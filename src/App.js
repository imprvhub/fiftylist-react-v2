import React, { useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import './styles/App.css';
import AuthenticationComponent from './components/AuthComponent';
import MainButtons from './components/MainButtons';
import TopSongsList from './components/TopSongsList';
import RecommendationsList from './components/RecommendationsList'; 
import logo from './images/logo.png';
import { supabase } from "./lib/helper/supabaseClient"

const clientId = process.env.REACT_APP_CLIENT_ID_EN;
const clientSecret = process.env.REACT_APP_CLIENT_SECRET_EN;
const redirectUri = "https://fiftylist.vercel.app/callback";
const scopes = process.env.REACT_APP_SCOPES;

const App = () => {
  const [accessToken, setAccessToken] = useState(null);
  const [timeRange, setTimeRange] = useState('short_term');
  const [topSongs, setTopSongs] = useState([]);
  const [artistInfo, setArtistInfo] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false); 
  const [topTracksIds, setTopTracksIds] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [isAuthenticationResolved, setIsAuthenticationResolved] = useState(false);
  const [generatedPageUrl, setGeneratedPageUrl] = useState('');

  
  useEffect(() => {
    const storedUrl = localStorage.getItem('generatedPageUrl');
    if (storedUrl) {
      setGeneratedPageUrl(storedUrl);
    }
    
    const handleAuthentication = async () => {
      const queryString = window.location.search;
      if (queryString.length > 0) {
        const urlParams = new URLSearchParams(queryString);
        const urlCode = urlParams.get('code');
        if (urlCode) {
          try {
            const response = await axios.post(
              'https://accounts.spotify.com/api/token',
              new URLSearchParams({
                grant_type: 'authorization_code',
                code: urlCode,
                redirect_uri: redirectUri,
                client_id: clientId,
                client_secret: clientSecret,
              }).toString(),
              {
                headers: {
                  'Content-Type': 'application/x-www-form-urlencoded',
                },
              }
            );

            const token = response.data.access_token;
            setAccessToken(token);
          } catch (error) {
            console.error('Error retrieving access token:', error);
          }
        }
      }
    };

    handleAuthentication();
  }, []);

  const handleTimeRangeChange = (event) => {
    setTimeRange(event.target.value);
  };

  const handleTermsChange = () => {
    setAcceptedTerms(!acceptedTerms);
  };

  const handleSpotifyLogin = () => {
    if (acceptedTerms) {
      window.location.href = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=${encodeURIComponent(scopes)}`;
    }
  };

  const getUserInfo = async () => {
    try {
      const response = await axios.get('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const userData = response.data;
      const userId = userData.id;
      const displayName = userData.display_name;
      const imageUrl = userData.images.length > 0 ? userData.images[0].url : null;
      const uri = userData.uri;
      const { data, error } = await supabase.from('users').insert([
        { userid: userId, displayname: displayName, imageurl: imageUrl, uri: uri },
      ]);
  
      if (error) {
        console.error('Error inserting data into Supabase:', error.message);
      } else {
        console.log('', data);
      }
      
    } catch (error) {
      console.error('Error retrieving user info:', error);
    }
  };

  const fetchArtistInfo = async (artistId) => {
    try {
      const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setArtistInfo((prevInfo) => ({
        ...prevInfo,
        [artistId]: response.data,
      }));
    } catch (error) {
      console.error(`Error retrieving artist info for artist ${artistId}:`, error);
    }
  };

  const getArtistName = (artistId) => {
    const artist = artistInfo[artistId];
    const artistName = artist ? artist.name : 'Loading...';
    
    return artistName;
  };


  const fetchGenresForSong = async (song) => {
    try {
      const artistId = song.artists[0].id;
      const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      const genres = response.data.genres;
      return genres;
    } catch (error) {
      console.error(`Error retrieving genres for song: ${song.name}`, error);
      return [];
    }
  };

  const fetchTopSongs = async () => {
    if (accessToken) {
      getUserInfo();
      try {
        let offset = 0;
        const response = await axios.get(
          `https://api.spotify.com/v1/me/top/tracks?time_range=${timeRange}&limit=50&offset=${offset}`,
          {
            headers: { Authorization: `Bearer ${accessToken}` },
          }
        );
        const trackIds = response.data.items.map((song) => song.id);
        const newTopTracksIds = trackIds.slice(0, 2);
        setTopTracksIds(newTopTracksIds);
        const songsWithInfo = await Promise.all(
          response.data.items.map(async (song) => {
            const albumId = song.album.id;
            const albumInfo = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            });
            const albumImage = albumInfo.data.images.find((image) => image.height === 300);
            const genres = await fetchGenresForSong(song);
            setIsAuthenticationResolved(true);
            return {
              ...song,
              albumImage: albumImage ? albumImage.url : null,
              release_date: albumInfo.data.release_date,
              genres,
            };
          })
        );

        setTopSongs(songsWithInfo);
        for (const song of songsWithInfo) {
          fetchArtistInfo(song.artists[0].id);
        }
      } catch (error) {
        console.log('Error retrieving top songs:', error);
      }
    }
  };

  const createRecommendationsPlaylist = async () => {
    try {
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      const userData = await userResponse.json();
      const user_id = userData.id;
  
      const playlistName = 'FiftyList - Recommendations Based On Your Fifty List!';
      const isPublic = true;
      const description = `
        This is an automated playlist by FiftyList. 
      `;
  
      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${user_id}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlistName,
            public: isPublic,
            description: description,
          }),
        }
      );
  
      if (createPlaylistResponse.status === 201) {
        const playlistData = await createPlaylistResponse.json();
        const playlist_id = playlistData.id;
        const playlistUrl = `https://open.spotify.com/playlist/${playlist_id}`;
  
        const uris = recommendedTracks.map((song) => song.uri);
        const addTracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uris }),
          }
        );
  
        if (addTracksResponse.status === 201) {
          window.open(
            `/html/recommendationsdetails.html?playlist_url=${encodeURIComponent(
              playlistUrl
            )}`,
            '_blank'
          );
        } else {
          console.error(
            'Error adding songs to the Spotify playlist:',
            await addTracksResponse.json()
          );
        }
      } else {
        console.error(
          'Error creating the playlist in Spotify:',
          await createPlaylistResponse.json()
        );
      }
    } catch (error) {
      console.error('Error in the playlist creation process:', error);
    }
  };
  
  const createSpotifyPlaylist = async () => {
    try {
      const userResponse = await fetch('https://api.spotify.com/v1/me', {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
  
      const userData = await userResponse.json();
      const user_id = userData.id;
      const playlistName = 'FiftyList - Fetching Your Top 50 Jams.';
      const isPublic = true;
      const description = `
        This is an automated playlist by FiftyList. 
      `;
  
      const createPlaylistResponse = await fetch(
        `https://api.spotify.com/v1/users/${user_id}/playlists`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: playlistName,
            public: isPublic,
            description: description,
          }),
        }
      );
  
      if (createPlaylistResponse.status === 201) {
        const playlistData = await createPlaylistResponse.json();
        const playlist_id = playlistData.id;
        const playlistUrl = `https://open.spotify.com/playlist/${playlist_id}`;
  
        const uris = topSongs.map((song) => song.uri);
        const addTracksResponse = await fetch(
          `https://api.spotify.com/v1/playlists/${playlist_id}/tracks`,
          {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${accessToken}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ uris }),
          }
        );
  
        if (addTracksResponse.status === 201) {
          window.open(
            `/html/playlistdetails.html?playlist_url=${encodeURIComponent(
              playlistUrl
            )}`,
            '_blank'
          );
        } else {
          console.error(
            'Error adding songs to the Spotify playlist:',
            await addTracksResponse.json()
          );
        }
      } else {
        console.error(
          'Error creating the playlist in Spotify:',
          await createPlaylistResponse.json()
        );
      }
    } catch (error) {
      console.error('Error in the playlist creation process:', error);
    }
  };

  function capitalizeWords(str) {
    return str.replace(/\b\w/g, function(char) {
      return char.toUpperCase();
    });
  }

  const dataExport = topSongs.map((song, index) => {
    const albumImage = song.album.images.length > 0 ? song.album.images[0].url : 'Undefined';
    const releaseDate = new Date(song.release_date);
    const formattedGenres = song.genres.length > 0 ? capitalizeWords(song.genres.slice(0, 3).join(', ')) : 'Undefined';
    const formattedDate = `${('0' + releaseDate.getDate()).slice(-2)}-${('0' + (releaseDate.getMonth() + 1)).slice(-2)}-${releaseDate.getFullYear()}`;
    const artistLink = `https://open.spotify.com/artist/${song.artists[0].id}`;
    const albumLink = `https://open.spotify.com/album/${song.album.id}`;
    const songLink = `https://open.spotify.com/track/${song.id}`;
    const songData = `${index + 1}. ${song.name}\n${getArtistName(song.artists[0].id)}\n${song.album.name}\n${formattedDate}\n${formattedGenres}\n${albumImage}\n${songLink}\n${artistLink}\n${albumLink}`;
    return songData;
  });

  const exportShare = async () => {
    try {
      const data = dataExport.join('\n\n');
      window.open('https://fiftylistbackend.vercel.app/share', '_blank');
      await new Promise(resolve => setTimeout(resolve, 1000));
  
      const response = await fetch('https://fiftylistbackend.vercel.app/share', {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain',
        },
        body: data,
      });
    } catch (error) {
      console.error('Error sending data to Flask:', error);
    }
  };

  const getRecommendations = useCallback(async () => {
    try {
      if (topSongs.length > 0) {
        const trackIds = topSongs.map((song) => song.id);
  
        const url = `https://api.spotify.com/v1/recommendations?limit=20&seed_tracks=${topTracksIds.join(',')}`;
        const response = await axios.get(url, {
          headers: { Authorization: `Bearer ${accessToken}` },
        });
  
        const recommendedTracksData = await Promise.all(
          response.data.tracks.map(async (recommendedSong) => {
            const albumId = recommendedSong.album.id;
            const albumInfo = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`, {
              headers: { Authorization: `Bearer ${accessToken}` },
            });
  
            const albumImage = albumInfo.data.images.find((image) => image.height === 300);
            const genres = await fetchGenresForSong(recommendedSong);
  
            return {
              ...recommendedSong,
              albumName: albumInfo.data.name,
              albumImage: albumImage ? albumImage.url : null,
              releaseDate: albumInfo.data.release_date,
              genres,
            };
          })
        );
  
        setRecommendedTracks(recommendedTracksData); 
  
      } else {
        console.warn('');
      }
    } catch (error) {
      console.error('Error Fetching Recommendations', error);
      console.error('Details:', error.response.data);
    }
  }, [topSongs, accessToken, topTracksIds, setRecommendedTracks]);

  useEffect(() => {
    if (topTracksIds.length > 0) {
      getRecommendations();
    }
  }, [getRecommendations, topTracksIds]);
  

  return (
    <div className="card">
    <div className="blobs">
      <div className="blob big-blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>
      <div className="blob"></div>
    </div>
    
    <div className="glass-cover"></div>
        <div className="App">
          <div className="logo-container">
            <img src={logo} alt="app-logo" className="centered-image" />
          </div>
            <AuthenticationComponent
            accessToken={accessToken}
            acceptedTerms={acceptedTerms}
            handleSpotifyLogin={handleSpotifyLogin}
            handleTermsChange={handleTermsChange}
          />
          <MainButtons
            timeRange={timeRange}
            handleTimeRangeChange={handleTimeRangeChange}
            accessToken={accessToken}
            topSongs={topSongs}
            fetchTopSongs={fetchTopSongs}
            exportShare={exportShare}
          />  
          <TopSongsList topSongs={topSongs} getArtistName={getArtistName} isAuthenticationResolved={isAuthenticationResolved} />
          <br></br>
          <br></br>
          <RecommendationsList recommendedTracks={recommendedTracks} isAuthenticationResolved={isAuthenticationResolved} />
          <span style={{ paddingBottom: '100px', display: 'block' }}></span>
          <br></br>
          <br></br>
          <div className="footer" style={{
            background: 'black',
            color: 'white',
            textAlign: 'center',
            padding: '10px',
            position: 'fixed',
            bottom: '0',
            width: '100%', 
            left: '50%', 
            transform: 'translateX(-50%)',
            fontSize: '13px'
          }}>
            <div className="dynamic-text">
              <a href="/html/howitworks.html" className="highlight" target="_blank" rel="noopener noreferrer" style={{ letterSpacing: '1.5px', textDecoration: 'none'  }}>
                How It Works?
              </a>
            </div>

            <div style={{ letterSpacing: '1.5px' }}>
              © 2024 Iván Luna. Software Developer.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>

              <a href="https://ivanluna.dev" target="_blank" rel="noopener noreferrer">
                <img src="images/icons/ivanlunadev.png" alt="Ivan Luna Dev" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
              </a>

              <a href="https://github.com/imprvhub" target="_blank" rel="noopener noreferrer">
                <img src="images/icons/github.png" alt="GitHub" style={{ width: '40px', height: '40px', marginRight: '10px' }} />
              </a>

              <a href="https://linkedin.com/in/ivanluna-dev" target="_blank" rel="noopener noreferrer">
                <img src="images/icons/linkedin.png" alt="LinkedIn" style={{ width: '40px', height: '40px' }} />
              </a>
            </div>
            </div>
    </div>
  </div>
  );
};

export default App;