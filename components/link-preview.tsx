"use client"

import { ExternalLink } from "lucide-react"

interface LinkPreviewProps {
  preview: {
    url: string
    title?: string | null
    description?: string | null
    image?: string | null
    siteName?: string | null
  }
}

export function LinkPreview({ preview }: LinkPreviewProps) {
  if (!preview.title && !preview.description && !preview.image) {
    return null
  }

  return (
    <a
      href={preview.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block mt-2 border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors group"
    >
      {preview.image && (
        <div className="w-full h-32 bg-muted overflow-hidden">
          <img
            src={preview.image}
            alt={preview.title || 'Link preview'}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      <div className="p-3 space-y-1">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <ExternalLink className="h-3 w-3" />
          <span className="truncate">{preview.siteName || new URL(preview.url).hostname}</span>
        </div>
        {preview.title && (
          <p className="font-medium text-sm line-clamp-2">{preview.title}</p>
        )}
        {preview.description && (
          <p className="text-xs text-muted-foreground line-clamp-2">{preview.description}</p>
        )}
      </div>
    </a>
  )
}

export function extractUrls(text: string): string[] {
  const urlRegex = /(https?:\/\/[^\s]+)/g
  return text.match(urlRegex) || []
}
