import React from 'react';
import { format } from 'date-fns';

const RecommendationsList = ({ recommendedTracks, isAuthenticationResolved, handleExportRecommendations }) => {
  return (
    <div>
      {isAuthenticationResolved && (
        <>
          <h4>Recommendations based on your Fifty List:</h4>
          <br></br>
        </>
      )}
      {recommendedTracks.length > 0 ? (
        <div className="scroll-container2">
          <br></br>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <button className="button-new" onClick={handleExportRecommendations}>
                <div style={{ display: 'flex', alignItems: 'center', padding: '3px'}}>
                  <img src="images/icons/addplaylist.png" alt="Exportar a Playlist" style={{ marginTop: '3px', width: '20px', height: '15px', marginRight: '5px' }} />
                  <div className="label-new" style={{ fontSize: '12px' }}>Add to new playlist</div>
                </div>
              </button>
          </div>
          <div className="song-list">
            <ul className="song-list-items">
              {recommendedTracks.map((track, index) => (
                <li key={index} className="song-list-item">
                  {track.albumImage && (
                    <img src={track.albumImage} alt="Album Cover" className="album-image" />
                  )}
                  
                  <div className="song-details">
                    <p className="song-name">
                      <strong>
                        <a
                          href={`https://open.spotify.com/track/${track.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="track-index">{index + 1}.</span> <span className="track-name">{track.name}</span>
                        </a>
                      </strong>
                    </p>
                    <p className="song-artist">
                      {track.artists.map((artist) => (
                        <a
                          key={artist.id}
                          href={`https://open.spotify.com/artist/${artist.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {artist.name}
                        </a>
                      )).reduce((prev, curr) => [prev, ', ', curr])}
                    </p>
                    <p className="song-info">
                      <span className="album-name">
                        <a
                          href={`https://open.spotify.com/album/${track.album.id}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <span className="album-label">Album: </span><span className="album-name-text">{track.albumName}</span>
                        </a>
                      </span>
                      <br />
                      <span className="release-date">Released: {format(new Date(track.releaseDate), 'dd-MM-yyyy')}</span>

                      <br />
                      <span className="genres">
                        Genres: {track.genres.length > 0 ? (
                          track.genres.slice(0, 3).map((genre, index, array) => (
                            <span key={index}>
                              <a
                                href={`https://open.spotify.com/search/genre:${genre}`}
                                target="_blank"
                                rel="noopener noreferrer"
                              >
                                {genre.charAt(0).toUpperCase() + genre.slice(1)}
                              </a>
                              {index !== array.length - 1 ? ', ' : '.'}
                            </span>
                          ))
                        ) : (
                          'Undefined.'
                        )}
                      </span>
                    </p>
                  </div>
                </li>
                
              ))}
              <br></br>
            </ul>
          </div>
          
        </div>
       
      ) : (
        <p></p>
      )}
    </div>
  );
};

export default RecommendationsList;
