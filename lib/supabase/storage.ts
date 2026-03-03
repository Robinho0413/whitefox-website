export function getGalleryPublicUrl(storagePath: string): string {
  const normalizedPath = storagePath.replace(/^gallery\//, "")
  const baseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL

  if (!baseUrl) {
    throw new Error("NEXT_PUBLIC_SUPABASE_URL is not defined")
  }

  return `${baseUrl}/storage/v1/object/public/gallery/${normalizedPath}`
}
