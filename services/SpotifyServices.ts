import { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } from "@env";

export async function getAccessToken() {
  const response = await fetch("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization:
        "Basic " + btoa(`${SPOTIFY_CLIENT_ID}:${SPOTIFY_CLIENT_SECRET}`),
    },
    body: "grant_type=client_credentials",
  });

  const data = await response.json();
  return data.access_token;
}

export async function fetchAlbums(artist: string, album: string) {
  try {
    const token = await getAccessToken();
    let query = "";

    if (artist && album) {
      query = `artist:${artist}&album:${album}`;
    } else if (artist) {
      query = `artist:${artist}`;
    } else if (album) {
      query = `album:${album}`;
    }

    const response = await fetch(
      `https://api.spotify.com/v1/search?q=${query}&type=album&limit=8`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const json = await response.json();
    return json;
  } catch (error) {
    console.log("error", error);
  }
}
