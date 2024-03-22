import React from 'react';

const AuthenticationComponent = ({ accessToken, acceptedTerms, handleSpotifyLogin, handleTermsChange }) => {
    const handleLanguageChange = (event) => {
        const selectedLanguage = event.target.value;
        if (selectedLanguage === 'Español') {
          window.close();
          window.open('https://fiftylist-es.vercel.app', '_blank');
        }
      };

    return (
      <div className="spotify-login-container">
        {!accessToken && (
          <div id="login-wrapper" style={{ maxHeight: '300px', overflowY: 'scroll', letterSpacing: '1px'}}>
            <div className="intro">
              <div id="up">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 15.75l7.5-7.5 7.5 7.5" />
                </svg>
              </div>
              <div className="language-picker-container">
              <div className="language-picker-selector">
                <select
                  id="language-picker"
                  style={{ padding: '5px 10px', borderRadius: '20px', textAlign: 'center', marginTop: '20px', letterSpacing: '1px'}}
                  onChange={handleLanguageChange}
                >
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
              </div>
              <h5 className="welcomeFl">Welcome to FiftyList!</h5>
              <div className="login-text-wrapper">
                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>To access, use the Spotify demonstration account.</p>

                <strong style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                  <span style={{ fontWeight: 'normal' }}>Username: </span><strong className="highlight">demo@ivanluna.dev</strong>
                  <br></br>
                  <span style={{ fontWeight: 'normal' }}>Password: </span><strong className="highlight">demo_123456</strong>
                </strong>

                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>To use your own personal Spotify account, provide the email with which you registered to <a className="highlight" href="mailto:contact@ivanluna.dev">contact@ivanluna.dev</a>. <a className="highlight" href="/html/howitworks.html" target="_blank"><b>More Information.</b></a></p>
                <h5>About the project:</h5>
                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                  This project is an automated music platform part of my portfolio on <a className="highlight" href="https://en.ivanluna.dev">ivanluna.dev</a>, which demonstrates a unique perspective of fullstack development.
                </p>
                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                  FiftyList delves into the intricacies of achieving different programming languages and APIs to collaborate smoothly through GET and POST methods. The goal was to create a unique synergy between two different worlds: <b>React</b> and <b>Python.</b><br></br><br></br>
                </p>

                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                  <a className="highlight">React (Frontend):</a> Here you interact directly with the Spotify API to get the 50 most listened-to songs by you in a specific period of time (1, 6 months, or all time). You can also create a new playlist on your Spotify account with those discoveries + our 20 recommendations based on your Fifty List. <strong>(New Feature)</strong>.
                </p>

                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                  <a className="highlight">Python (Backend):</a> Using Flask as a framework, the backend serves as a bridge that enables social media sharing functionality for music lists. It receives data from React about your Fifty List and passes it to FiftyCard, where it's dynamically organized into a static website with a unique URL. This includes artist names, song titles, album names, release dates, and genres.
                </p>

                <h5>Privacy Policies and Terms of Use:</h5>

                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                  Please note that FiftyList is for learning and demonstration purposes. Review our <a className="highlight" href="/html/privacypolicy.html" target="_blank"><u>Privacy Policies</u></a> and <a className="highlight" href="/html/termsandconditions.html" style={{ textDecoration: 'none'}} target="_blank"><u>Terms of Use</u></a>. If you have any inquiries or doubts, please contact <a className="highlight" href="mailto:contact@ivanluna.dev">contact@ivanluna.dev</a>. 
                </p>
              </div>

              <div id="down">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </div>
            </div>
          </div>
        )}
        <div className="spotify-login-container">
          {!accessToken && (
            <div id="login-wrapper" style={{ maxHeight: '150px', overflowY: 'scroll', letterSpacing: '1px' }}>
              <div className="terms-checkbox">
                <input
                  type="checkbox"
                  id="terms-checkbox"
                  checked={acceptedTerms}
                  onChange={handleTermsChange}
                />
                <label htmlFor="terms-checkbox" style={{fontSize: '10px', textTransform: 'uppercase', marginBottom: '30px'}}>
                  I have read, understood, and accepted the <a className="highlight" href="/html/privacypolicy.html" target="_blank"><b>Privacy Policies</b></a> and <a className="highlight" href="/html/termsandconditions.html" target="_blank"><b>Terms of Use</b></a>
                </label>
                </div>
                <button
                  onClick={handleSpotifyLogin}
                  className={`button-spotify-login ${acceptedTerms ? '' : 'disabled'}`}
                  disabled={!acceptedTerms}
                >
                  Log in to Spotify
                </button>
            </div>
          )}
        </div>
      </div>
    );
  };
  
  export default AuthenticationComponent;
