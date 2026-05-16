"use client"
import { useState } from "react"
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react"

export default function VehicleGallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
        <div className="flex h-72 w-full items-center justify-center rounded-xl bg-muted text-muted-foreground">
          <ImageOff className="h-12 w-12 opacity-30" />
        </div>
    )
  }

  return (
      <div className="space-y-2">
        <div className="relative overflow-hidden rounded-xl bg-muted aspect-[16/9]">
          <img src={images[active]} alt={`Vehicle image ${active + 1}`} className="h-full w-full object-cover" />
          {images.length > 1 && (
              <>
                <button onClick={() => setActive(i => (i - 1 + images.length) % images.length)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setActive(i => (i + 1) % images.length)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/50 p-1.5 text-white hover:bg-black/70 transition-colors">
                  <ChevronRight className="h-4 w-4" />
                </button>
                <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-2 py-0.5 text-xs text-white">
              {active + 1} / {images.length}
            </span>
              </>
          )}
        </div>
        {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => (
                  <button key={i} onClick={() => setActive(i)}
                          className={`h-16 w-24 shrink-0 overflow-hidden rounded-lg border-2 transition-colors ${i === active ? "border-primary" : "border-transparent"}`}>
                    <img src={img} alt="" className="h-full w-full object-cover" />
                  </button>
              ))}
            </div>
        )}
      </div>
  )
}