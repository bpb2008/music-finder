import React, { useState } from "react";

interface SpotifyTrack {
  id: string;
  name: string;
  artists: { name: string }[];
  preview_url: string | null;
}

const MusicApp: React.FC = () => {
  const [query, setQuery] = useState("");
  const [musicList, setMusicList] = useState<SpotifyTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<SpotifyTrack | null>(null);

  const getAccessToken = async (): Promise<string> => {
    const clientId = import.meta.env.VITE_SPOTIFY_CLIENT_ID;
    const clientSecret = import.meta.env.VITE_SPOTIFY_CLIENT_SECRET;

    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        Authorization: `Basic ${btoa(`${clientId}:${clientSecret}`)}`,
      },
      body: "grant_type=client_credentials",
    });

    if (!response.ok) {
      throw new Error("Failed to get access token");
    }

    const data = await response.json();
    return data.access_token;
  };

  const handleSearch = async () => {
    try {
      const accessToken = await getAccessToken();

      const response = await fetch(
        `https://api.spotify.com/v1/search?q=${encodeURIComponent(
          query
        )}&type=track&limit=10`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Failed to fetch music");
      }

      const data = await response.json();
      setMusicList(data.tracks.items);
      setError(null);
    } catch (err) {
      setError("An error occurred while searching for music.");
    }
  };

  const handleSelectMusic = (music: SpotifyTrack) => {
    setSelectedMusic(music);
  };
  console.log(musicList);

  return (
    <div className="music-app">
      <header className="app-header">
        <h1>Music Finder</h1>
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search for songs, artists..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
      </header>

      {error && <div className="error-alert">{error}</div>}

      <div className="music-list">
        {musicList.map((music) => (
          <div className="music-item" key={music.id}>
            <h3>{music.name}</h3>
            <p>{music.artists.map((artist) => artist.name).join(", ")}</p>
            {music.preview_url ? (
              <button onClick={() => handleSelectMusic(music)}>
                Play Preview
              </button>
            ) : (
              <p>No Preview Available</p>
            )}
          </div>
        ))}
      </div>

      {selectedMusic && selectedMusic.preview_url && (
        <div className="music-player">
          <h2>Now Playing: {selectedMusic.name}</h2>
          <audio controls src={selectedMusic.preview_url} autoPlay />
        </div>
      )}
    </div>
  );
};

export default MusicApp;
