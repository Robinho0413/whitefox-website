"use client"

import { useEffect, useRef, useState } from "react"
import { useFormStatus } from "react-dom"

type PreviewItem = {
  id: string
  type: "image" | "video"
  url: string
  fileName: string
}

type MultiMediaUploadFieldProps = {
  required?: boolean
  inputId?: string
  name?: string
  accept?: string
}

function revokePreviewUrls(items: PreviewItem[]) {
  for (const item of items) {
    URL.revokeObjectURL(item.url)
  }
}

export default function MultiMediaUploadField({
  required = true,
  inputId = "image_files",
  name = "image_files",
  accept = "image/*,video/*",
}: MultiMediaUploadFieldProps) {
  const { pending } = useFormStatus()
  const inputRef = useRef<HTMLInputElement | null>(null)
  const wasPendingRef = useRef(false)
  const [isDragging, setIsDragging] = useState(false)
  const [previewItems, setPreviewItems] = useState<PreviewItem[]>([])

  useEffect(() => {
    if (wasPendingRef.current && !pending) {
      if (inputRef.current) {
        inputRef.current.value = ""
      }

      setPreviewItems((currentItems) => {
        revokePreviewUrls(currentItems)
        return []
      })
      setIsDragging(false)
    }

    wasPendingRef.current = pending
  }, [pending])

  useEffect(() => {
    return () => {
      revokePreviewUrls(previewItems)
    }
  }, [previewItems])

  const setSelectedFiles = (files: FileList | null) => {
    if (!files || files.length === 0) {
      setPreviewItems((currentItems) => {
        revokePreviewUrls(currentItems)
        return []
      })
      return
    }

    const selectedFiles = Array.from(files).filter(
      (file) => file.type.startsWith("image/") || file.type.startsWith("video/")
    )

    setPreviewItems((currentItems) => {
      revokePreviewUrls(currentItems)
      return selectedFiles.map((file, index) => ({
        id: `${file.name}-${index}-${file.lastModified}`,
        type: file.type.startsWith("video/") ? "video" : "image",
        url: URL.createObjectURL(file),
        fileName: file.name,
      }))
    })
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedFiles(event.target.files)
  }

  const handleDragOver = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (event: React.DragEvent<HTMLLabelElement>) => {
    event.preventDefault()
    setIsDragging(false)

    if (!inputRef.current) {
      return
    }

    const droppedFiles = event.dataTransfer.files
    const dataTransfer = new DataTransfer()

    Array.from(droppedFiles).forEach((file) => {
      if (file.type.startsWith("image/") || file.type.startsWith("video/")) {
        dataTransfer.items.add(file)
      }
    })

    inputRef.current.files = dataTransfer.files
    setSelectedFiles(dataTransfer.files)
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor={inputId}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex min-h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-input bg-muted/30 p-4 text-center transition-colors hover:bg-muted/50 ${
          isDragging ? "bg-muted/60 border-primary-500" : ""
        }`}
      >
        {previewItems.length > 0 ? (
          <div className="flex w-full flex-wrap justify-center gap-2">
            {previewItems.slice(0, 6).map((item) => (
              <div key={item.id} className="relative h-20 w-20 overflow-hidden rounded-md border bg-background sm:h-24 sm:w-24">
                {item.type === "image" ? (
                  <img src={item.url} alt={item.fileName} className="h-full w-full object-cover" />
                ) : (
                  <video src={item.url} className="h-full w-full object-cover" muted />
                )}
              </div>
            ))}
            {previewItems.length > 6 && (
              <div className="flex h-20 w-20 items-center justify-center rounded-md border bg-background text-xs font-medium sm:h-24 sm:w-24">
                +{previewItems.length - 6} fichier(s)
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">Cliquez pour sélectionner des fichiers</p>
            <p className="text-xs text-muted-foreground">
              ou glissez-déposez vos médias (images/vidéos)
            </p>
          </div>
        )}
      </label>

      <input
        ref={inputRef}
        id={inputId}
        name={name}
        type="file"
        accept={accept}
        multiple
        required={required}
        className="sr-only"
        onChange={handleChange}
      />

      <p className="text-xs text-muted-foreground">
        {previewItems.length > 0
          ? `${previewItems.length} fichier(s) sélectionné(s)`
          : "Aucun fichier sélectionné"}
      </p>
    </div>
  )
}