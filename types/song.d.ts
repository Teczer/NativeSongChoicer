export interface RootObject {
  albums: Albums;
}

export interface Albums {
  href: string;
  items: Item[];
  limit: number;
  next?: any;
  offset: number;
  previous?: any;
  total: number;
}

export interface Item {
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

export interface Image {
  height: number;
  url: string;
  width: number;
}

export interface Artist {
  external_urls: Externalurls;
  href: string;
  id: string;
  name: string;
  type: string;
  uri: string;
}

export interface Externalurls {
  spotify: string;
}
