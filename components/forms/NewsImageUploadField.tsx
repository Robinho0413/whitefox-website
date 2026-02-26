"use client"

import { useEffect, useRef, useState } from "react"

type NewsImageUploadFieldProps = {
  required?: boolean
  initialImageUrl?: string | null
}

function revokePreviewUrl(url: string | null) {
  if (url && url.startsWith("blob:")) {
    URL.revokeObjectURL(url)
  }
}

export default function NewsImageUploadField({
  required = true,
  initialImageUrl = null,
}: NewsImageUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(initialImageUrl)
  const [fileName, setFileName] = useState("")
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    return () => {
      revokePreviewUrl(previewUrl)
    }
  }, [previewUrl])

  const setSelectedFile = (file?: File) => {
    if (!file) {
      revokePreviewUrl(previewUrl)
      setPreviewUrl(null)
      setFileName("")
      return
    }

    if (!file.type.startsWith("image/")) {
      return
    }

    revokePreviewUrl(previewUrl)

    setFileName(file.name)
    setPreviewUrl(URL.createObjectURL(file))
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setSelectedFile(file)
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

    const file = event.dataTransfer.files?.[0]
    if (!file || !inputRef.current) {
      return
    }

    const dataTransfer = new DataTransfer()
    dataTransfer.items.add(file)
    inputRef.current.files = dataTransfer.files
    setSelectedFile(file)
  }

  return (
    <div className="space-y-2">
      <label
        htmlFor="image_file"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative flex h-64 w-full cursor-pointer items-center justify-center overflow-hidden rounded-md border border-dashed border-input bg-muted/30 p-4 text-center transition-colors hover:bg-muted/50 ${
          isDragging ? "bg-muted/60 border-primary-500" : ""
        }`}
      >
        {previewUrl ? (
          <img
            src={previewUrl}
            alt="Aperçu de l'image"
            className="h-full w-full object-contain"
          />
        ) : (
          <div className="space-y-1">
            <p className="text-sm font-medium">Cliquez pour sélectionner une image</p>
            <p className="text-xs text-muted-foreground">ou glissez-déposez une image (PNG, JPG, WEBP…)</p>
          </div>
        )}
      </label>

      <input
        ref={inputRef}
        id="image_file"
        name="image_file"
        type="file"
        accept="image/*"
        required={required}
        className="sr-only"
        onChange={handleChange}
      />

      <p className="text-xs text-muted-foreground">
        {fileName ? `Fichier sélectionné : ${fileName}` : "Aucun fichier sélectionné"}
      </p>
    </div>
  )
}
