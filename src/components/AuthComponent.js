import React, { useState } from 'react';
import { supabase } from "../lib/helper/supabaseClient";

const AuthenticationComponent = ({ accessToken, acceptedTerms, handleSpotifyLogin, handleTermsChange }) => {
    const [showProjectInfo, setShowProjectInfo] = useState(false);
    const [showTermsInfo, setShowTermsInfo] = useState(false);
    const [rotateIcon, setRotateIcon] = useState(false);
    const [email, setEmail] = useState('');
    const [showEmailContainer, setShowEmailContainer] = useState(true);
    const [loginText, setLoginText] = useState(
        <p style={{ fontSize: '10px', textTransform: 'uppercase' }}>
            To access, add your Spotify account to the <strong>allowed users</strong> list.
            <a className="highlight" href="/html/howitworks.html" target="_blank">
                <b style={{ fontSize: '10px' }}> More Information.</b>
            </a>
        </p>
    );
   
    const handleLanguageChange = (selectedLanguage) => {
        if (selectedLanguage === 'Español') {
            window.location.href = 'https://fiftylist-es.vercel.app';
        }
    };
    
    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };

    const handleAddEmail = async () => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                alert("Enter an email with valid format please.");
                return;
            }
        try {
            const { data, error } = await supabase.from('emails').insert([{ email }]);
            if (error) {
                alert("An error has ocurred when trying to add your email to the list of allowed users.");
                console.error('Error adding email:', error.message);
            } else {
                alert("Congratulations! Your account will be added to the list of allowed users. You will receive a confirmation email once the process is completed. Thanks for choosing Fiftylist!");
                console.log('', data);
                setShowEmailContainer(false); 
                setLoginText("Thanks for choosing Fiftylist! Your account is being added to the list of allowed users. You will receive a confirmation email once the process is completed.");
            }
        } catch (error) {
            alert("An error has happened when trying to add your email to the list of allowed users. Please try again later.");
            console.error('Error adding email:', error);
        }
        };

  return (
    <div className="spotify-login-container">
        {!accessToken && (
            <div id="login-wrapper" style={{ maxHeight: '300px', overflowY: 'scroll', letterSpacing: '1px' }}>
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
                            style={{ padding: '5px 10px', borderRadius: '10px', textAlign: 'center', marginTop: '20px', letterSpacing: '1px' }}
                            onChange={(event) => handleLanguageChange(event.target.value)}
                        >
                            <option>English</option>
                            <option>Español</option>
                        </select>
                        </div>
                    </div>
                    <h5 className="welcomeFl">Welcome to FiftyList!</h5>
                    <div className="login-text-wrapper" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                            {loginText}
                        {showEmailContainer && ( 
                        <div className="spotify-login-container-email">
                            <div className="spotify-email-main-container">
                                <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>SPOTIFY ACCOUNT EMAIL: </span>
                                <div className="spotify-email-container">
                                    <input 
                                        type="text" 
                                        placeholder="user@example.com" 
                                        value={email} 
                                        onChange={handleEmailChange} 
                                    />
                                    <input
                                        style={{ fontSize: '10px', textTransform: 'uppercase'}}
                                        type="submit"
                                        value="ADD"
                                        onClick={handleAddEmail}
                                    />
                                </div>
                            </div>
                        </div>
                        )}
                        <p style={{ fontSize: '10px', textTransform: 'uppercase' }}>Already in the <strong>allowed users</strong> list? After accepting the privacy policies and terms of use, log in with Spotify.</p>
                        <div className="title-container" onClick={() => setShowProjectInfo(!showProjectInfo)}>
                            <div className={`icon ${showProjectInfo ? '' : 'rotate'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                            About the Project
                        </div>
                        {showProjectInfo && (
                            <div>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                                    This project is a musical automation platform and is part of the portfolio <a className="highlight" href="https://en.ivanluna.dev">ivanluna.dev</a>.
                                </p>
                                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                                  FiftyList delves into the intricacies of making different programming languages collaborate seamlessly through GET and POST methods. The goal was to create a unique synergy between two different worlds: <b>React</b> and <b>Python.</b><br></br><br></br>
                                </p>
                      
                                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                                  <a className="highlight">React (Frontend):</a> Here you interact directly with the Spotify API to get the 50 most listened to songs by you in a specific period of time (1, 6 months, or all time). You can also create a new playlist in your Spotify account with those discoveries + our 20 recommendations based on your Fifty List.
                                </p>
                    
                                <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                                  <a className="highlight">Python (Backend):</a> Using Flask as a framework, the backend serves as a bridge that enables sharing functionality on social networks for music lists. It receives data from React about your Fifty List and passes it to FiftyCard, where it is dynamically organized into a static website with a unique URL. This includes artist names, song titles, album names, release dates, and genres.
                                </p>
                            </div>
                        )}

                        <div className="title-container" onClick={() => setShowTermsInfo(!showTermsInfo)} style={{ marginTop: '20px' }}>
                          <div className={`icon ${showTermsInfo ? '' : 'rotate'}`}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="12">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                </svg>
                            </div>
                            Privacy Policies and Terms of Use
                        </div>
                        {showTermsInfo && (
                            <div>
                                <p style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                                    Please note that FiftyList is for learning and demonstration purposes. Review our <a className="highlight" href="/html/privacypolicy.html" target="_blank"><u>Privacy Policies</u></a> and <a className="highlight" href="/html/termsandconditions.html" style={{ textDecoration: 'none' }} target="_blank"><u>Terms of Use</u></a>. If you have any questions or concerns, please contact <a className="highlight" href="mailto:contact@ivanluna.dev">contact@ivanluna.dev</a>.
                                </p>
                            </div>
                        )}

                        <div id="down">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                    </div>
              </div>
          </div>
        )}
        <div className="spotify-login-container-terms">
            {!accessToken && (
                <div id="login-wrapper" style={{ maxHeight: '150px', overflowY: 'scroll', letterSpacing: '1px' }}>
                    <div className="terms-checkbox">
                        <input
                            type="checkbox"
                            id="terms-checkbox"
                            checked={acceptedTerms}
                            onChange={handleTermsChange}
                        />
                        <label htmlFor="terms-checkbox" style={{ fontSize: '10px', textTransform: 'uppercase', marginBottom: '30px' }}>
                            I have read, understood, and accepted the <a className="highlight" href="/html/privacypolicy.html" target="_blank"><b>Privacy Policies</b></a> and <a className="highlight" href="/html/termsandconditions.html" target="_blank"><b>Terms of Use</b></a>
                        </label>
                    </div>
                    <button
                        onClick={handleSpotifyLogin}
                        className={`button-spotify-login ${acceptedTerms ? '' : 'disabled'}`}
                        disabled={!acceptedTerms}
                    >
                        Log in with Spotify
                    </button>
                </div>
            )}
        </div>
    </div>
);
};

export default AuthenticationComponent;
