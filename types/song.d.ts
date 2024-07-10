// TYPES FOR SPOTIFY API SEARCH

interface SearchResponse {
  albums: Albums;
}

interface Albums {
  href: string;
  items: Item[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

interface Item {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  external_urls: Externalurls;
  href: string;
  id: string;
  images: Image[];
  name: string;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  type: string;
  uri: string;
}

interface Image {
  height: number;
  url: string;
  width: number;
}

interface Artist {
  external_urls: Externalurls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

interface Externalurls {
  spotify: string;
}

// TYPES FOR SPOTIFY API ALBUM

interface SimpleSong {
  id: number;
  title: string;
}

interface Song {
  id: number;
  title: string;
  image: {
    height?: number;
    url: string;
    width?: number;
  };
}

type Versus = [Song, Song];

type Album = SpotifyApi.AlbumObjectSimplified;

interface AlbumResponse {
  album_type: string;
  artists: Artist[];
  available_markets: string[];
  copyrights: Copyright[];
  external_ids: Externalids;
  external_urls: Externalurls;
  genres: any[];
  href: string;
  id: string;
  images: Image[];
  label: string;
  name: string;
  popularity: number;
  release_date: string;
  release_date_precision: string;
  total_tracks: number;
  tracks: Tracks;
  type: string;
  uri: string;
}
interface Tracks {
  href: string;
  items: Item[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}
interface Item {
  artists: Artist[];
  available_markets: string[];
  disc_number: number;
  duration_ms: number;
  explicit: boolean;
  external_urls: Externalurls;
  href: string;
  id: string;
  is_local: boolean;
  name: string;
  preview_url: string;
  track_number: number;
  type: string;
  uri: string;
}
interface Image {
  height: number;
  url: string;
  width: number;
}
interface Externalids {
  upc: string;
}
interface Copyright {
  text: string;
  type: string;
}
interface Artist {
  external_urls: Externalurls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}
interface Externalurls {
  spotify: string;
}
