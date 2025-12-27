export type UploadImageRequest = {
  file: File
  draftId: string
}

export type UploadImageResponse = {
  imageId: number
  relativePath: string
  url: string
}
