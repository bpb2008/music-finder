import React, { useState } from "react";

interface ITunesTrack {
  trackId: number;
  trackName: string;
  artistName: string;
  previewUrl: string | null;
}

const ItunesApp: React.FC = () => {
  const [query, setQuery] = useState<string>("");
  const [musicList, setMusicList] = useState<ITunesTrack[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [selectedMusic, setSelectedMusic] = useState<ITunesTrack | null>(null);

  const handleSearch = async (): Promise<void> => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${encodeURIComponent(
          query
        )}&limit=10`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch music");
      }
      const data = await response.json();
      setMusicList(data.results);
      setError(null);
    } catch (err) {
      setError("An error occurred while searching for music.");
    }
  };

  const handleSelectMusic = (music: ITunesTrack): void => {
    setSelectedMusic(music);
  };

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
          <div className="music-item" key={music.trackId}>
            <h3>{music.trackName}</h3>
            <p>{music.artistName}</p>
            <button onClick={() => handleSelectMusic(music)}>
              Play Preview
            </button>
          </div>
        ))}
      </div>

      {selectedMusic && (
        <div className="music-player">
          <h2>Now Playing: {selectedMusic.trackName}</h2>
          <audio controls src={selectedMusic.previewUrl || ""} autoPlay />
        </div>
      )}
    </div>
  );
};

export default ItunesApp;
