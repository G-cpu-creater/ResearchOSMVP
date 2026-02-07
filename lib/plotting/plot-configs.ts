import type { PlotConfig, ParsedData } from '@/types'

export function createCVPlot(data: ParsedData): PlotConfig {
  const { columns, rows } = data.data

  // Find potential and current columns
  const potentialIdx = columns.findIndex(c =>
    c.toLowerCase().includes('ewe') ||
    c.toLowerCase().includes('potential') ||
    c.toLowerCase().includes('voltage')
  )

  const currentIdx = columns.findIndex(c =>
    c.toLowerCase().includes('i') && !c.toLowerCase().includes('time') ||
    c.toLowerCase().includes('current')
  )

  if (potentialIdx === -1 || currentIdx === -1) {
    throw new Error('Could not find potential and current columns for CV plot')
  }

  const potential = rows.map(row => row[potentialIdx] as number)
  const current = rows.map(row => row[currentIdx] as number)

  return {
    type: 'cv_plot',
    xAxis: {
      column: columns[potentialIdx],
      label: columns[potentialIdx],
      scale: 'linear',
    },
    yAxis: {
      column: columns[currentIdx],
      label: columns[currentIdx],
      scale: 'linear',
    },
    data: [
      {
        x: potential,
        y: current,
        type: 'scatter',
        mode: 'lines',
        name: 'CV Curve',
        line: {
          color: '#2563eb',
          width: 2,
        },
      },
    ],
    layout: {
      title: 'Cyclic Voltammogram',
      xaxis: {
        title: columns[potentialIdx],
        zeroline: true,
        zerolinewidth: 1,
        zerolinecolor: '#999',
      },
      yaxis: {
        title: columns[currentIdx],
        zeroline: true,
        zerolinewidth: 1,
        zerolinecolor: '#999',
      },
      hovermode: 'closest',
      showlegend: false,
    },
  }
}

export function createNyquistPlot(data: ParsedData): PlotConfig {
  const { columns, rows } = data.data

  // Find Re(Z) and Im(Z) columns
  const reIdx = columns.findIndex(c =>
    c.toLowerCase().includes('re(z)') ||
    c.toLowerCase().includes('z\'') ||
    c.toLowerCase().includes('zreal')
  )

  const imIdx = columns.findIndex(c =>
    c.toLowerCase().includes('-im(z)') ||
    c.toLowerCase().includes('z\'\'') ||
    c.toLowerCase().includes('zimag')
  )

  if (reIdx === -1 || imIdx === -1) {
    throw new Error('Could not find impedance columns for Nyquist plot')
  }

  const zReal = rows.map(row => row[reIdx] as number)
  const zImag = rows.map(row => {
    const val = row[imIdx] as number
    // Convention: -Im(Z) on y-axis
    return val < 0 ? val : -val
  })

  return {
    type: 'nyquist',
    xAxis: {
      column: columns[reIdx],
      label: 'Z\' (Ω)',
      scale: 'linear',
    },
    yAxis: {
      column: columns[imIdx],
      label: '-Z\'\' (Ω)',
      scale: 'linear',
    },
    data: [
      {
        x: zReal,
        y: zImag,
        type: 'scatter',
        mode: 'lines+markers',
        name: 'Nyquist',
        marker: {
          size: 6,
          color: '#2563eb',
        },
        line: {
          color: '#2563eb',
          width: 2,
        },
      },
    ],
    layout: {
      title: 'Nyquist Plot',
      xaxis: {
        title: 'Z\' (Ω)',
      },
      yaxis: {
        title: '-Z\'\' (Ω)',
        scaleanchor: 'x',
        scaleratio: 1,
      },
      hovermode: 'closest',
      showlegend: false,
    },
  }
}

export function createBodePlot(data: ParsedData): PlotConfig[] {
  const { columns, rows } = data.data

  // Find frequency and impedance magnitude/phase columns
  const freqIdx = columns.findIndex(c =>
    c.toLowerCase().includes('freq') ||
    c.toLowerCase().includes('frequency')
  )

  const magIdx = columns.findIndex(c =>
    c.toLowerCase().includes('|z|') ||
    c.toLowerCase().includes('magnitude') ||
    c.toLowerCase().includes('modulus')
  )

  const phaseIdx = columns.findIndex(c =>
    c.toLowerCase().includes('phase') ||
    c.toLowerCase().includes('phi')
  )

  if (freqIdx === -1 || magIdx === -1 || phaseIdx === -1) {
    throw new Error('Could not find frequency, magnitude, and phase columns for Bode plot')
  }

  const freq = rows.map(row => row[freqIdx] as number)
  const mag = rows.map(row => row[magIdx] as number)
  const phase = rows.map(row => row[phaseIdx] as number)

  return [
    {
      type: 'line',
      xAxis: {
        column: columns[freqIdx],
        label: 'Frequency (Hz)',
        scale: 'log',
      },
      yAxis: {
        column: columns[magIdx],
        label: '|Z| (Ω)',
        scale: 'log',
      },
      data: [
        {
          x: freq,
          y: mag,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Magnitude',
          marker: { size: 5, color: '#2563eb' },
          line: { color: '#2563eb', width: 2 },
        },
      ],
      layout: {
        title: 'Bode Plot - Magnitude',
        xaxis: {
          title: 'Frequency (Hz)',
          type: 'log',
        },
        yaxis: {
          title: '|Z| (Ω)',
          type: 'log',
        },
        hovermode: 'closest',
      },
    },
    {
      type: 'line',
      xAxis: {
        column: columns[freqIdx],
        label: 'Frequency (Hz)',
        scale: 'log',
      },
      yAxis: {
        column: columns[phaseIdx],
        label: 'Phase (°)',
        scale: 'linear',
      },
      data: [
        {
          x: freq,
          y: phase,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Phase',
          marker: { size: 5, color: '#dc2626' },
          line: { color: '#dc2626', width: 2 },
        },
      ],
      layout: {
        title: 'Bode Plot - Phase',
        xaxis: {
          title: 'Frequency (Hz)',
          type: 'log',
        },
        yaxis: {
          title: 'Phase (°)',
        },
        hovermode: 'closest',
      },
    },
  ]
}

export function createBatteryCyclingPlot(data: ParsedData): PlotConfig[] {
  const { columns, rows } = data.data

  // Find cycle, capacity, voltage columns
  const cycleIdx = columns.findIndex(c =>
    c.toLowerCase().includes('cycle')
  )

  const capacityIdx = columns.findIndex(c =>
    c.toLowerCase().includes('capacity') ||
    c.toLowerCase().includes('cap')
  )

  const voltageIdx = columns.findIndex(c =>
    c.toLowerCase().includes('voltage') ||
    c.toLowerCase().includes('potential')
  )

  if (cycleIdx === -1 || capacityIdx === -1) {
    throw new Error('Could not find cycle and capacity columns for battery cycling plot')
  }

  const cycles = rows.map(row => row[cycleIdx] as number)
  const capacity = rows.map(row => row[capacityIdx] as number)

  const plots: PlotConfig[] = [
    {
      type: 'battery_cycling',
      xAxis: {
        column: columns[cycleIdx],
        label: 'Cycle Number',
        scale: 'linear',
      },
      yAxis: {
        column: columns[capacityIdx],
        label: columns[capacityIdx],
        scale: 'linear',
      },
      data: [
        {
          x: cycles,
          y: capacity,
          type: 'scatter',
          mode: 'lines+markers',
          name: 'Capacity',
          marker: { size: 5, color: '#2563eb' },
          line: { color: '#2563eb', width: 2 },
        },
      ],
      layout: {
        title: 'Capacity vs Cycle Number',
        xaxis: {
          title: 'Cycle Number',
        },
        yaxis: {
          title: columns[capacityIdx],
        },
        hovermode: 'closest',
      },
    },
  ]

  return plots
}

export function createGenericPlot(
  data: ParsedData,
  xColumn: string,
  yColumn: string
): PlotConfig {
  const { columns, rows } = data.data

  const xIdx = columns.indexOf(xColumn)
  const yIdx = columns.indexOf(yColumn)

  if (xIdx === -1 || yIdx === -1) {
    throw new Error('Specified columns not found in dataset')
  }

  const xData = rows.map(row => row[xIdx] as number)
  const yData = rows.map(row => row[yIdx] as number)

  return {
    type: 'line',
    xAxis: {
      column: xColumn,
      label: xColumn,
      scale: 'linear',
    },
    yAxis: {
      column: yColumn,
      label: yColumn,
      scale: 'linear',
    },
    data: [
      {
        x: xData,
        y: yData,
        type: 'scatter',
        mode: 'lines+markers',
        name: `${yColumn} vs ${xColumn}`,
        marker: { size: 5, color: '#2563eb' },
        line: { color: '#2563eb', width: 2 },
      },
    ],
    layout: {
      title: `${yColumn} vs ${xColumn}`,
      xaxis: {
        title: xColumn,
      },
      yaxis: {
        title: yColumn,
      },
      hovermode: 'closest',
      showlegend: false,
    },
  }
}
