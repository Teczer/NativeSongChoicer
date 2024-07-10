import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "@env";
// ACCESS TOKEN

export async function getAccessToken() {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization:
          "Basic " + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error("Failed to get access token:", error);
    throw error;
  }
}

// SPOTIFY DATA API

const BASE_URL = "https://api.spotify.com/v1";

export async function fetchAlbums(artist: string, album: string) {
  try {
    const token = await getAccessToken();
    const response = await fetch(
      `${BASE_URL}/search?q=${artist} ${album}&type=album&limit=8`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const json: SearchResponse = await response.json();
    const filteredAlbums = json.albums.items.filter(
      (album) => album.total_tracks >= 3
    );
    return filteredAlbums;
  } catch (error) {
    console.error("Failed to fetch albums:", error);
    throw error;
  }
}

export async function fetchAlbumById(albumId: string) {
  try {
    const token = await getAccessToken();
    const response = await fetch(`${BASE_URL}/albums/${albumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data; // Retourne les pistes de l'album
  } catch (error) {
    console.error("Failed to fetch album tracks:", error);
    throw error;
  }
}
