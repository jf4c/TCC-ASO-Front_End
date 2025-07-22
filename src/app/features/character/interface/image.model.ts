export interface Images {
  images: Image[]
}

export interface Image {
  id: string
  name: string
  url: string
  description?: string
}
