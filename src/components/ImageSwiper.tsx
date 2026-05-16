"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { type CarouselApi, Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { cloudinaryLoader } from "@/lib/cloudinary-loader"
import { cn } from "@/lib/utils"

interface ImageSwiperProps {
    images: string[]
    alt: string
    height?: string        // tailwind h-* class e.g. "h-48"
    overlay?: React.ReactNode
}

export default function ImageSwiper({ images, alt, height = "h-48", overlay }: ImageSwiperProps) {
    const [api, setApi] = useState<CarouselApi>()
    const [current, setCurrent] = useState(0)

    useEffect(() => {
        if (!api) return
        setCurrent(api.selectedScrollSnap())
        api.on("select", () => setCurrent(api.selectedScrollSnap()))
    }, [api])

    if (!images.length) return null

    return (
        <div className="relative w-full">
            <Carousel
                setApi={setApi}
                opts={{ loop: true, align: "center" }}
                className="w-full"
            >
                <CarouselContent>
                    {images.map((src, i) => (
                        <CarouselItem key={src}>
                            <div className={cn("relative w-full bg-muted", height)}>
                                <Image
                                    loader={cloudinaryLoader}
                                    src={src}
                                    alt={`${alt} ${i + 1}`}
                                    fill
                                    className="object-cover"
                                    priority={i === 0}
                                />
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Only show arrows when there are multiple images */}
                {images.length > 1 && (
                    <>
                        <CarouselPrevious className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7" />
                        <CarouselNext className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-7 w-7" />
                    </>
                )}
            </Carousel>

            {/* Overlay (e.g. locked blur) */}
            {overlay && (
                <div className="absolute inset-0 z-20 pointer-events-none">
                    {overlay}
                </div>
            )}

            {/* Dot indicators */}
            {images.length > 1 && (
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1 z-10">
                    {images.map((_, i) => (
                        <button
                            key={i}
                            onClick={() => api?.scrollTo(i)}
                            className={cn(
                                "h-1.5 rounded-full transition-all",
                                i === current ? "w-4 bg-white" : "w-1.5 bg-white/50"
                            )}
                            aria-label={`Go to image ${i + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    )
}