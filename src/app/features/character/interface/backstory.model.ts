export interface CharacterBackstoryRequest {
  name: string
  ancestry: string
  class: string
  supplements?: string
}

export interface CharacterBackstoryResponse {
  text: string
}
