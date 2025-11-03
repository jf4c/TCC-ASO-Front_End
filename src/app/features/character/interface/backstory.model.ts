export interface CharacterBackstoryRequest {
  name: string
  ancestry: string
  class: string
  attributes?: string
  skills?: string
  supplements?: string
}

export interface CharacterBackstoryResponse {
  text: string
}
