import React from 'react';
import { format } from 'date-fns';

const TopSongsList = ({ topSongs, getArtistName, isAuthenticationResolved, handleExportPlaylist }) => {
  return (
    <div>
      {isAuthenticationResolved && (
        <>
          <h4>Results:</h4>
          <br></br>
        </>
      )}
      {topSongs.length > 0 && (
        <div className="scroll-container">
          <br></br>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="button-new" onClick={handleExportPlaylist}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '3px'}}>
                  <img src="images/icons/addplaylist.png" alt="Exportar a Playlist" style={{ marginTop: '3px', width: '20px', height: '15px', marginRight: '5px' }} />
                  <div className="label-new" style={{ fontSize: '12px' }}>Add to a new playlist</div>
                </div>
              </button>
          </div>
          <div className="song-list">
            <ul className="song-list-items">
              {topSongs.map((song, index) => (
                <li key={song.id} className="song-list-item">
                  {song.albumImage && (
                    <img src={song.albumImage} alt="Album Cover" className="album-image" />
                  )}

                  <div className="song-details" style={{ fontSize: '13px' }}>
                  <p className="song-name">
                    <a href={`https://open.spotify.com/track/${song.id}`} target="_blank" rel="noopener noreferrer">
                      <span className="song-index">{index + 1}. </span>
                      <span className="song-name-text">{song.name}</span>
                    </a>
                  </p>
                    <p className="song-artist">
                      <a href={`https://open.spotify.com/artist/${song.artists[0].id}`} target="_blank" rel="noopener noreferrer">
                        {getArtistName(song.artists[0].id)}
                      </a>
                    </p>
                    <p className="song-info">
                      <span className="album-name">
                      <a href={`https://open.spotify.com/album/${song.album.id}`} target="_blank" rel="noopener noreferrer">
                        Album: <span className="album-name-text">{song.album.name}</span>
                      </a>
                      </span>
                      <br />
                      <span className="release-date">
                        Released: {format(new Date(song.release_date), 'dd-MM-yyyy')}
                      </span>
                      <br />
                      <span className="genres">
                        Genres: {song.genres.length > 0 ? song.genres.slice(0, 3).map((genre, index, array) =>
                          `${genre.charAt(0).toUpperCase() + genre.slice(1)}${index !== array.length - 1 ? ', ' : '.'}`
                        ) : 'Undefined.'}
                      </span>
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default TopSongsList;
