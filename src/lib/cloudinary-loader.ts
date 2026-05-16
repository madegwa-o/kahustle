// lib/cloudinary-loader.ts
export function cloudinaryLoader({
                                     src,
                                     width,
                                     quality,
                                 }: {
    src: string
    width: number
    quality?: number
}) {
    // If it's already a full Cloudinary URL, extract the path after /upload/
    const uploadIndex = src.indexOf("/upload/")
    const path = uploadIndex !== -1 ? src.slice(uploadIndex + 8) : src
    return `https://res.cloudinary.com/ddwpqrl4o/image/upload/f_auto,c_limit,w_${width},q_${quality ?? "auto"}/${path}`
}