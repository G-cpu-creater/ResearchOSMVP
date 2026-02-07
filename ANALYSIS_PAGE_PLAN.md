# Analysis Page - Detailed Implementation Plan

## 1. Architecture Overview

### 1.1 Data Flow
```
Visualization Page → Upload CSV → Parse & Store Dataset
                                         ↓
                            Analysis Page (Access Shared State)
                                         ↓
                    Extract Column Headers & Data Arrays
                                         ↓
                    Display Variables in Right Ribbon
                                         ↓
        Drag Variable → Canvas → Create Plot (Index vs Variable)
                                         ↓
        Drag Variable → Plot Axis → Update Axis Assignment
```

### 1.2 State Management (Zustand Store)

**Store Structure:**
```typescript
interface AnalysisStore {
  // Dataset
  dataset: {
    filename: string
    headers: string[]
    data: Record<string, number[]>  // { "Column1": [1,2,3], "Column2": [4,5,6] }
    indexArray: number[]             // Auto-generated [0,1,2,...]
  } | null
  
  // Plots
  plots: Record<string, Plot>        // { "plot-1": {...}, "plot-2": {...} }
  
  // Actions
  setDataset: (dataset: Dataset) => void
  createPlot: (variableName: string, position: { x: number, y: number }) => string
  updatePlotAxis: (plotId: string, axis: 'x' | 'y', variableName: string) => void
  updatePlotPosition: (plotId: string, position: { x: number, y: number }) => void
  updatePlotSize: (plotId: string, size: { width: number, height: number }) => void
  deletePlot: (plotId: string) => void
}

interface Plot {
  id: string
  xVariable: string      // Variable name or 'index'
  yVariable: string      // Variable name
  position: { x: number, y: number }
  size: { width: number, height: number }
  createdAt: number
}
```

---

## 2. Component Structure

### 2.1 Component Hierarchy
```
AnalysisPage/
├── AnalysisCanvas (main workspace)
│   └── PlotCard[] (movable/resizable)
│       ├── PlotlyChart
│       ├── AxisDropZone (x-axis)
│       └── AxisDropZone (y-axis)
│
└── VariableRibbon (fixed right panel)
    └── VariableItem[] (draggable)
```

### 2.2 Component Specifications

#### **AnalysisPage.tsx**
- Root component
- Layout container (canvas + ribbon)
- Initializes DndContext from dnd-kit
- Handles drop events on canvas

#### **AnalysisCanvas.tsx**
- Free-form workspace area
- Canvas drop zone (for creating new plots)
- Renders all PlotCard components
- Absolute positioning container

#### **PlotCard.tsx**
- Uses react-rnd for drag/resize
- Renders Plotly chart
- Contains axis drop zones
- Shows variable labels for each axis
- Handles plot deletion

#### **AxisDropZone.tsx**
- Drop target overlay for x/y axes
- Visual feedback on drag hover
- Triggers axis update on drop

#### **VariableRibbon.tsx**
- Fixed right sidebar (e.g., width: 250px)
- Scrollable variable list
- Shows dataset info header

#### **VariableItem.tsx**
- Draggable variable chip
- Shows variable name
- Displays data preview (first 3 values)
- Uses useDraggable from dnd-kit

---

## 3. Drag & Drop Implementation (dnd-kit)

### 3.1 Draggable Items (Variables)
```typescript
// VariableItem.tsx
const { attributes, listeners, setNodeRef, transform } = useDraggable({
  id: `variable-${variableName}`,
  data: { type: 'variable', name: variableName }
})
```

### 3.2 Drop Zones

**Canvas Drop Zone (Create Plot):**
```typescript
// AnalysisCanvas.tsx
const { setNodeRef } = useDroppable({
  id: 'canvas-drop-zone',
  data: { type: 'canvas' }
})

// On drop:
if (active.data.type === 'variable') {
  createPlot(active.data.name, dropPosition)
}
```

**Axis Drop Zones (Update Axis):**
```typescript
// AxisDropZone.tsx
const { isOver, setNodeRef } = useDroppable({
  id: `${plotId}-${axis}-axis`,
  data: { type: 'axis', plotId, axis }
})

// On drop:
if (active.data.type === 'variable') {
  updatePlotAxis(plotId, axis, active.data.name)
}
```

### 3.3 Drop Feedback
- Canvas: Show semi-transparent plot preview at cursor
- Axis zones: Highlight border (green on hover)
- Variable items: Reduce opacity during drag

---

## 4. Plot Management

### 4.1 Plot Creation Workflow
1. User drags variable from ribbon
2. Drops on canvas
3. Generate unique plot ID: `plot-${Date.now()}`
4. Create plot object:
   - xVariable: 'index'
   - yVariable: [dropped variable name]
   - position: drop coordinates
   - size: default 400x300
5. Add to store
6. Render PlotCard with react-rnd

### 4.2 Axis Update Workflow
1. User drags variable from ribbon
2. Drops on plot's x-axis or y-axis zone
3. Update plot object in store
4. Plotly auto-rerenders with new data

### 4.3 Plot Data Transformation
```typescript
function getPlotData(plot: Plot, dataset: Dataset) {
  const xData = plot.xVariable === 'index' 
    ? dataset.indexArray 
    : dataset.data[plot.xVariable]
    
  const yData = dataset.data[plot.yVariable]
  
  return {
    data: [{
      x: xData,
      y: yData,
      type: 'scatter',
      mode: 'lines+markers'
    }],
    layout: {
      xaxis: { title: plot.xVariable },
      yaxis: { title: plot.yVariable }
    }
  }
}
```

---

## 5. Canvas Layout & Positioning

### 5.1 Canvas Container
```css
.analysis-canvas {
  position: relative;
  width: calc(100% - 250px);  /* Subtract ribbon width */
  height: 100vh;
  overflow: auto;
  background: #f8f9fa;
}
```

### 5.2 Plot Card (react-rnd)
```typescript
<Rnd
  position={{ x: plot.position.x, y: plot.position.y }}
  size={{ width: plot.size.width, height: plot.size.height }}
  onDragStop={(e, d) => updatePlotPosition(plot.id, { x: d.x, y: d.y })}
  onResizeStop={(e, dir, ref, delta, position) => {
    updatePlotSize(plot.id, {
      width: ref.offsetWidth,
      height: ref.offsetHeight
    })
    updatePlotPosition(plot.id, position)
  }}
  minWidth={300}
  minHeight={250}
  bounds="parent"
>
  {/* Plot content */}
</Rnd>
```

### 5.3 Variable Ribbon
```css
.variable-ribbon {
  position: fixed;
  right: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: white;
  border-left: 1px solid #e5e7eb;
  overflow-y: auto;
  z-index: 50;
}
```

---

## 6. Dataset Integration

### 6.1 Data Transfer from Visualization Page
Two approaches:

**Option A: Zustand Store (Recommended)**
```typescript
// lib/stores/datasetStore.ts
interface DatasetStore {
  currentDataset: Dataset | null
  setDataset: (dataset: Dataset) => void
}

// When user uploads in VisualizationTab:
const { setDataset } = useDatasetStore()
setDataset({ filename, headers, data, indexArray })

// In AnalysisPage:
const { currentDataset } = useDatasetStore()
```

**Option B: Session Storage**
```typescript
// Save in VisualizationTab
sessionStorage.setItem('dataset', JSON.stringify(dataset))

// Load in AnalysisPage
const dataset = JSON.parse(sessionStorage.getItem('dataset'))
```

### 6.2 Data Parsing from CSV
```typescript
function parseDataset(csvData: string[][]) {
  const headers = csvData[0]
  const rows = csvData.slice(1)
  
  const data: Record<string, number[]> = {}
  headers.forEach((header, colIndex) => {
    data[header] = rows.map(row => parseFloat(row[colIndex]) || 0)
  })
  
  const indexArray = Array.from({ length: rows.length }, (_, i) => i)
  
  return { headers, data, indexArray }
}
```

---

## 7. Implementation Phases

### **Phase 1: Foundation (Week 1)**
- [ ] Install dependencies (dnd-kit, react-rnd, zustand, plotly.js)
- [ ] Create Zustand store structure
- [ ] Build basic AnalysisPage layout
- [ ] Implement VariableRibbon component
- [ ] Create VariableItem draggable components

### **Phase 2: Drag & Drop Core (Week 1-2)**
- [ ] Set up DndContext in AnalysisPage
- [ ] Implement canvas drop zone
- [ ] Add drop event handlers
- [ ] Create basic plot on variable drop
- [ ] Test drag-to-create workflow

### **Phase 3: Plot Management (Week 2)**
- [ ] Integrate react-rnd for PlotCard
- [ ] Implement plot positioning/resizing
- [ ] Add Plotly chart rendering
- [ ] Connect plot data to Zustand store
- [ ] Add plot delete functionality

### **Phase 4: Axis Updates (Week 2-3)**
- [ ] Create AxisDropZone components
- [ ] Implement drop-on-axis detection
- [ ] Update plot axis assignments
- [ ] Add visual feedback for drop zones
- [ ] Test axis reassignment workflow

### **Phase 5: Dataset Integration (Week 3)**
- [ ] Create shared dataset store
- [ ] Integrate with VisualizationTab upload
- [ ] Handle dataset updates
- [ ] Add dataset info display
- [ ] Test full data flow

### **Phase 6: Polish & UX (Week 3-4)**
- [ ] Add plot styling controls
- [ ] Implement plot title editing
- [ ] Add grid snapping (optional)
- [ ] Improve drag previews
- [ ] Add keyboard shortcuts
- [ ] Responsive design adjustments

### **Phase 7: Advanced Features (Week 4+)**
- [ ] Multi-variable plots (multiple y-series)
- [ ] Plot templates (bar, line, scatter presets)
- [ ] Export canvas as image
- [ ] Save/load canvas layouts
- [ ] Plot annotations

---

## 8. File Structure

```
components/
├── analysis/
│   ├── AnalysisPage.tsx           # Root component
│   ├── AnalysisCanvas.tsx         # Workspace area
│   ├── PlotCard.tsx               # Movable/resizable plot
│   ├── AxisDropZone.tsx           # Drop target for axes
│   ├── VariableRibbon.tsx         # Right sidebar
│   └── VariableItem.tsx           # Draggable variable chip
│
lib/
├── stores/
│   ├── analysisStore.ts           # Plot state management
│   └── datasetStore.ts            # Shared dataset state
│
├── utils/
│   ├── plotUtils.ts               # Plot data transformation
│   └── datasetParser.ts           # CSV parsing helpers
│
types/
└── analysis.ts                     # TypeScript interfaces
```

---

## 9. TypeScript Interfaces

```typescript
// types/analysis.ts

export interface Dataset {
  filename: string
  headers: string[]
  data: Record<string, number[]>
  indexArray: number[]
  uploadedAt: number
}

export interface Plot {
  id: string
  xVariable: string
  yVariable: string
  position: Position
  size: Size
  plotType: 'scatter' | 'line' | 'bar'
  markerColor: string
  markerSize: number
  showLegend: boolean
  createdAt: number
}

export interface Position {
  x: number
  y: number
}

export interface Size {
  width: number
  height: number
}

export interface DragData {
  type: 'variable'
  name: string
}

export interface DropData {
  type: 'canvas' | 'axis'
  plotId?: string
  axis?: 'x' | 'y'
}
```

---

## 10. Key Dependencies

```json
{
  "dependencies": {
    "@dnd-kit/core": "^6.1.0",
    "@dnd-kit/utilities": "^3.2.2",
    "react-rnd": "^10.4.1",
    "zustand": "^4.5.0",
    "plotly.js": "^2.35.3",
    "react-plotly.js": "^2.6.0"
  }
}
```

---

## 11. Performance Considerations

### 11.1 Optimization Strategies
- **Lazy render plots**: Only render visible plots in viewport
- **Memoize plot data**: Use `useMemo` for data transformations
- **Debounce resize**: Prevent excessive Plotly rerenders during resize
- **Virtual scrolling**: For large variable lists (100+ columns)

### 11.2 Example Optimizations
```typescript
// Memoize plot data
const plotData = useMemo(() => 
  getPlotData(plot, dataset), 
  [plot.xVariable, plot.yVariable, dataset]
)

// Debounce resize
const handleResize = useDebouncedCallback((size) => {
  updatePlotSize(plotId, size)
}, 150)
```

---

## 12. User Experience Enhancements

### 12.1 Visual Feedback
- **Drag preview**: Semi-transparent plot follows cursor
- **Drop zone highlight**: Green border on valid drop target
- **Variable hover**: Show data preview tooltip
- **Plot hover**: Show axis variable names

### 12.2 Interactions
- **Double-click plot**: Open settings modal
- **Right-click plot**: Context menu (delete, duplicate, export)
- **Ctrl+drag variable**: Create line plot instead of scatter
- **Shift+click plots**: Multi-select for batch operations

### 12.3 Empty States
- No dataset: "Upload a dataset in the Visualization tab"
- Empty canvas: "Drag a variable here to create your first plot"
- No variables: "Your dataset has no numeric columns"

---

## 13. Testing Strategy

### 13.1 Unit Tests
- Store actions (plot creation, updates)
- Data transformation utilities
- Dataset parsing logic

### 13.2 Integration Tests
- Drag variable → plot created
- Drop on axis → axis updated
- Plot resize → size persisted

### 13.3 E2E Tests (Playwright)
- Full workflow: upload → create plots → arrange → export
- Multi-plot canvas management
- Axis reassignment scenarios

---

## 14. Future Enhancements

### Phase 2 Features
- **Multi-Y plots**: Drag multiple variables onto y-axis
- **Plot linking**: Synchronized zoom/pan across plots
- **Custom formulas**: Create calculated columns
- **Statistical overlays**: Add trendlines, error bars
- **Plot groups**: Organize plots into sections
- **Canvas templates**: Predefined layouts (2x2, 3x1, etc.)

### Advanced Analytics
- **Auto-correlation**: Suggest variable pairings
- **Outlier detection**: Highlight anomalous points
- **Distribution overlays**: Histograms, box plots
- **Time series**: Automatic time axis detection

---

## 15. Success Metrics

### MVP Success Criteria
- ✅ Upload dataset with 10 columns, 1000 rows
- ✅ Create 5+ plots on canvas
- ✅ Drag variable to axis updates plot < 200ms
- ✅ Resize plot smoothly (60fps)
- ✅ No crashes with 20+ plots

### Performance Targets
- Initial render: < 1s
- Plot creation: < 300ms
- Axis update: < 200ms
- Drag interaction: 60fps
- Memory: < 100MB for 10 plots

---

## 16. Implementation Checklist

### Pre-Development
- [ ] Review plan with team
- [ ] Set up development branch
- [ ] Install dependencies
- [ ] Create mock dataset for testing

### Core Development
- [ ] Implement Zustand stores
- [ ] Build component structure
- [ ] Integrate dnd-kit
- [ ] Add react-rnd plots
- [ ] Connect Plotly rendering

### Integration
- [ ] Link to VisualizationTab dataset
- [ ] Test full workflow
- [ ] Add error handling
- [ ] Implement empty states

### Polish
- [ ] Styling & responsive design
- [ ] Accessibility (keyboard nav)
- [ ] Documentation
- [ ] User guide

### Deployment
- [ ] Code review
- [ ] Testing (unit + E2E)
- [ ] Performance audit
- [ ] Production deployment

---

## End of Implementation Plan
