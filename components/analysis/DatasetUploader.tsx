'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Upload, FileText, Loader2, CheckCircle2, XCircle } from 'lucide-react'
import { useToast } from '@/components/ui/use-toast'

interface DatasetUploaderProps {
  projectId: string
  onUploadComplete?: () => void
}

export function DatasetUploader({ projectId, onUploadComplete }: DatasetUploaderProps) {
  const [file, setFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const { toast } = useToast()

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (selectedFile) {
      setFile(selectedFile)
      setError('')
      setSuccess(false)
    }
  }

  const handleUpload = async () => {
    if (!file) return

    setUploading(true)
    setError('')
    setSuccess(false)

    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await fetch(`/api/projects/${projectId}/datasets/upload`, {
        method: 'POST',
        body: formData,
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setSuccess(true)
      setFile(null)

      toast({
        variant: 'success',
        title: 'Dataset uploaded successfully!',
        description: `${file.name} has been parsed and added to your project.`,
      })

      if (onUploadComplete) {
        onUploadComplete()
      }
    } catch (err: any) {
      setError(err.message)
      toast({
        variant: 'destructive',
        title: 'Upload failed',
        description: err.message,
      })
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Upload className="h-5 w-5 mr-2" />
          Upload Dataset
        </CardTitle>
        <CardDescription>
          Upload electrochemistry data files (.mpt, .dta, .csv)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="border-2 border-dashed rounded-lg p-8 text-center">
            <input
              type="file"
              id="file-upload"
              accept=".mpt,.dta,.csv,.txt"
              onChange={handleFileChange}
              className="hidden"
            />
            <label
              htmlFor="file-upload"
              className="cursor-pointer flex flex-col items-center"
            >
              {file ? (
                <>
                  <FileText className="h-12 w-12 text-blue-600 mb-2" />
                  <p className="font-medium">{file.name}</p>
                  <p className="text-sm text-gray-500">
                    {(file.size / 1024).toFixed(2)} KB
                  </p>
                </>
              ) : (
                <>
                  <Upload className="h-12 w-12 text-gray-400 mb-2" />
                  <p className="font-medium">Click to select file</p>
                  <p className="text-sm text-gray-500">
                    Supports .mpt, .dta, .csv files
                  </p>
                </>
              )}
            </label>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-start">
              <XCircle className="h-5 w-5 text-red-600 mr-2 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-medium text-red-800">Upload failed</p>
                <p className="text-sm text-red-600">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-50 border border-green-200 rounded-md flex items-center">
              <CheckCircle2 className="h-5 w-5 text-green-600 mr-2" />
              <p className="text-sm font-medium text-green-800">
                File uploaded and parsed successfully!
              </p>
            </div>
          )}

          <div className="flex space-x-2">
            <Button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="flex-1"
            >
              {uploading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload
                </>
              )}
            </Button>
            {file && !uploading && (
              <Button
                variant="outline"
                onClick={() => {
                  setFile(null)
                  setError('')
                  setSuccess(false)
                }}
              >
                Clear
              </Button>
            )}
          </div>

          <div className="text-xs text-gray-500 space-y-1">
            <p className="font-medium">Supported formats:</p>
            <ul className="list-disc list-inside space-y-0.5">
              <li>.mpt - BioLogic EC-Lab files</li>
              <li>.dta - Gamry data files</li>
              <li>.csv - Generic comma-separated values</li>
              <li>.txt - Tab or comma delimited text</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
