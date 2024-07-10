/**
 * MainView Types
 */

export interface Ability {
  name: string;
  url: string;
}

export interface Abilitie {
  ability: Ability;
  is_hidden: boolean;
  slot: number;
}

export interface Crie {
  latest: string;
  legacy: string;
}

export interface Form {
  name: string;
  url: string;
}

export interface Version {
  name: string;
  url: string;
}

export interface GameIndice {
  game_index: number;
  version: Version;
}

export interface Item {
  name: string;
  url: string;
}

export interface VersionDetail {
  rarity: number;
  version: Version;
}

export interface HeldItem {
  item: Item;
  version_details: VersionDetail[];
}

export interface Move {
  name: string;
  url: string;
}

export interface MoveLearnMethod {
  name: string;
  url: string;
}

export interface VersionGroup {
  name: string;
  url: string;
}

export interface VersionGroupDetail {
  level_learned_at: number;
  move_learn_method: MoveLearnMethod;
  version_group: VersionGroup;
}

export interface MoveGroup {
  move: Move;
  version_group_details: VersionGroupDetail[];
}

export interface Specie {
  name: string;
  url: string;
}

export interface DreamWorld {
  front_default: string;
  front_female: object;
}

export interface Home {
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
}

export interface OfficialArtwork {
  front_default: string;
  front_shiny: string;
}

export interface Showdown {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: object;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
}

export interface Other {
  dream_world: DreamWorld;
  home: Home;
  "official-artwork": OfficialArtwork;
  showdown: Showdown;
}

export interface Sprite {
  back_default: string;
  back_female: string;
  back_shiny: string;
  back_shiny_female: string;
  front_default: string;
  front_female: string;
  front_shiny: string;
  front_shiny_female: string;
  other: Other;
  versions: Version;
}

export interface Stat {
  name: string;
  url: string;
}

export interface StatGroup {
  base_stat: number;
  effort: number;
  stat: Stat;
}

export interface Type {
  name: string;
  url: string;
}

export interface TypeGroup {
  slot: number;
  type: Type;
}

/* MainView Query Object */

export interface Pokemon {
  abilities: Abilitie[];
  base_experience: number;
  cries: Crie;
  forms: Form[];
  game_indices: GameIndice[];
  height: number;
  held_items: HeldItem[];
  id: number;
  is_default: boolean;
  location_area_encounters: string;
  moves: MoveGroup[];
  name: string;
  order: number;
  past_abilities: undefined[];
  past_types: undefined[];
  species: Specie;
  sprites: Sprite;
  stats: StatGroup[];
  types: TypeGroup[];
  weight: number;
}

/**
 * POKEDEX Types
 */

export interface SimplePokemon {
  name: string;
  url: string;
}

/* POKEDEX Query Object */

export type PokemonList = SimplePokemon[];
