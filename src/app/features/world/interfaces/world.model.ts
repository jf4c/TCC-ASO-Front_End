/// Interfaces para representar mundos de RPG com lore, locais e panteão

/**
 * Entrada de lore - informações gerais sobre o mundo
 */
export interface LoreEntry {
  id: string;
  title: string;
  content: string;
}

/**
 * Entrada de local - lugares importantes no mundo
 */
export interface LocationEntry {
  id: string;
  title: string;
  description: string;
}

/**
 * Entrada de panteão - divindades e seus domínios
 */
export interface PantheonEntry {
  id: string;
  name: string;
  title: string;
  description: string;
  domains: string[];
}

/**
 * Mundo básico para listagem
 */
export interface World {
  id: string;
  name: string;
  description: string;
  imageUrl?: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Detalhes completos do mundo incluindo lore, locais e panteão
 */
export interface WorldDetail extends World {
  lore: LoreEntry[];
  locations: LocationEntry[];
  pantheon: PantheonEntry[];
}

/**
 * DTO para criar novo mundo
 */
export interface CreateWorldDto {
  name: string;
  description: string;
  imageUrl?: string;
  lore?: LoreEntry[];
  locations?: LocationEntry[];
  pantheon?: PantheonEntry[];
}

/**
 * DTO para atualizar mundo existente
 */
export interface UpdateWorldDto {
  name?: string;
  description?: string;
  imageUrl?: string | null;
  lore?: LoreEntry[];
  locations?: LocationEntry[];
  pantheon?: PantheonEntry[];
}
