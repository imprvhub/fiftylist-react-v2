import React, { useState, useEffect } from 'react';
import { supabase } from "../lib/helper/supabaseClient";

const AuthenticationComponent = ({ accessToken, acceptedTerms, handleSpotifyLogin, handleTermsChange }) => {
    const [showProjectInfo, setShowProjectInfo] = useState(false);
    const [showTermsInfo, setShowTermsInfo] = useState(false);
    const [rotateIcon, setRotateIcon] = useState(false);
    const [email, setEmail] = useState('');
    const [showEmailContainer, setShowEmailContainer] = useState(true);
    const [loginText, setLoginText] = useState(
        <p style={{ fontSize: '10px', textTransform: 'uppercase' }}>
            Para acceder, agregue su cuenta de Spotify a la lista de <strong>usuarios permitidos</strong>.
            <a className="highlight" href="/html/howitworks.html" target="_blank">
                <b style={{ fontSize: '10px' }}> Más Información.</b>
            </a>
        </p>
    );

    const handleScroll = () => {
        const loginWrapper = document.getElementById('login-wrapper');
        const upIcon = document.getElementById('upIcon');
        const downIcon = document.getElementById('downIcon');
        const extraHeight = (showEmailContainer || showProjectInfo || showTermsInfo) ? 814.84 : 0; // Ajusta este valor según la altura de los elementos ocultos
        if (loginWrapper && upIcon && downIcon) {
            if (loginWrapper.scrollTop === 0) {
                upIcon.style.display = 'none';
            } else {
                upIcon.style.display = 'block';
            }
            if (loginWrapper.scrollTop + loginWrapper.offsetHeight >= loginWrapper.scrollHeight + extraHeight) {
                downIcon.style.display = 'none';
            } else {
                downIcon.style.display = 'block';
            }
        }
    };

    useEffect(() => {
        const loginWrapper = document.getElementById('login-wrapper');
        if (loginWrapper) {
            loginWrapper.addEventListener('scroll', handleScroll);
            return () => {
                loginWrapper.removeEventListener('scroll', handleScroll);
            };
        }
    }, []);

    const handleScrollUp = () => {
        const loginWrapper = document.getElementById('login-wrapper');
        if (loginWrapper) {
            loginWrapper.scrollTop -= 200; 
        }
    };

    const handleScrollDown = () => {
        const loginWrapper = document.getElementById('login-wrapper');
        if (loginWrapper) {
            loginWrapper.scrollTop += 200;
        }
    };

    const handleLanguageChange = (selectedLanguage) => {
        if (selectedLanguage === 'English') {
            window.location.href = 'https://fiftylist.vercel.app';
        }
      };

    const handleEmailChange = (event) => {
        setEmail(event.target.value);
    };
    

    const handleAddEmail = async () => {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert("Por favor, ingrese un correo electrónico válido.");
            return;
        }
      try {
          const { data, error } = await supabase.from('emails').insert([{ email, lang: 'fiftylist-spanish'  }]);
          if (error) {
              alert("Lo sentimos, ha ocurrido un error al intentar agregar su correo electrónico a la lista de usuarios permitidos. Por favor, inténtelo nuevamente más tarde.");
              console.error('Error al insertar el correo electrónico:', error.message);
          } else {
              alert("¡Felicidades! Su cuenta será añadida a la lista de usuarios permitidos. Recibirá un correo electrónico de confirmación una vez completado el proceso. ¡Gracias por elegir Fiftylist!");
              console.log('', data);
              setShowEmailContainer(false); 
              setLoginText("¡Gracias por elegir FiftyList! Su cuenta está siendo añadida a la lista de usuarios permitidos. Recibirá un correo electrónico de confirmación una vez completado el proceso.");
          }
      } catch (error) {
          alert("Lo sentimos, ha ocurrido un error al intentar agregar su correo electrónico a la lista de usuarios permitidos. Por favor, inténtelo nuevamente más tarde.");
          console.error('Error al agregar el correo electrónico:', error);
      }
    };


    return (
        <div className="spotify-login-container">
            {!accessToken && (
                <div id="login-wrapper" style={{ maxHeight: '300px', overflowY: 'scroll', letterSpacing: '1px' }}>
                    <div className="intro">
                        <div id="up">
                            <svg id="upIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20"   onClick={handleScrollUp}>
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
                                    <option>Español</option>
                                    <option>English</option>
                                </select>
                            </div>
                        </div>
                        <h5 className="welcomeFl">¡Bienvenid@s a FiftyList!</h5>
                        <div className="login-text-wrapper" style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                            {loginText}
                        {showEmailContainer && ( 
                            <div className="spotify-login-container-email">
                                <div className="spotify-email-main-container">
                                    <span style={{ fontSize: '10px', textTransform: 'uppercase' }}>EMAIL DE SU CUENTA DE SPOTIFY: </span>
                                    <div className="spotify-email-container">
                                        <input 
                                            type="text" 
                                            placeholder="usuario@ejemplo.com" 
                                            value={email} 
                                            onChange={handleEmailChange} 
                                        />
                                        <input 
                                            style={{ fontSize: '10px', textTransform: 'uppercase' }} 
                                            type="submit" 
                                            value="AGREGAR" 
                                            onClick={handleAddEmail} 
                                        />
                                    </div>
                                </div>
                            </div>
                            )}
                            <p style={{ fontSize: '10px', textTransform: 'uppercase' }}>¿Ya se encuentra en la lista de <strong>usuarios permitidos</strong>? Luego de aceptar las políticas de privacidad y términos de uso, inicie sesión con Spotify.</p>
                            <div className="title-container" onClick={() => setShowProjectInfo(!showProjectInfo)}>
                            <div className={`icon ${showProjectInfo ? '' : 'rotate'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                                Sobre el proyecto
                            </div>
                            {showProjectInfo && (
                                <div>
                                    <p style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                                        Este proyecto es una plataforma de automatización musical y forma parte del portfolio <a className="highlight" href="https://es.ivanluna.dev">ivanluna.dev</a>.
                                    </p>
                                    <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                                      FiftyList profundiza en lo intricado de lograr que diferentes lenguajes de programación colaboren fluidamente a través de métodos GET y POST. El objetivo fue crear una sinergia unica entre dos mundos distintos: <b>React</b> and <b>Python.</b><br></br><br></br>
                                    </p>
                          
                                    <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                                      <a className="highlight">React (Frontend):</a> Aquí se interactua directamente con la API de Spotify para obtener las 50 canciones más escuchadas por usted en un período de tiempo especifico (1, 6 meses o todos los tiempos). También se puede crear una nueva playlist en su cuenta de Spotify con esos descubrimientos + nuestras 20 recomendaciones basadas en su Fifty List.
                                    </p>
                        
                                    <p style={{fontSize: '10px', textTransform: 'uppercase'}}>
                                      <a className="highlight">Python (Backend):</a> Utilizando Flask como framework, el backend sirve como un puente que habilita la funcionalidad de compartir en redes sociales para las listas de música. Recibe datos de React sobre tu Fifty List y los pasa a FiftyCard, donde se organizan dinámicamente en un sitio web estático con una URL única. Esto incluye nombres de artistas, títulos de canciones, nombres de álbumes, fechas de lanzamiento y géneros.
                                    </p>
                                </div>
                            )}

                            <div className="title-container" onClick={() => setShowTermsInfo(!showTermsInfo)} style={{ marginTop: '20px' }}>
                              <div className={`icon ${showTermsInfo ? '' : 'rotate'}`}>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="12">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                                    </svg>
                                </div>
                                Políticas de privacidad y Términos de Uso
                            </div>
                            {showTermsInfo && (
                                <div>
                                    <p style={{ fontSize: '10px', textTransform: 'uppercase' }}>
                                        Tenga en cuenta que FiftyList tiene fines de aprendizaje y demostración. Revea nuestras <a className="highlight" href="/html/privacypolicy.html" target="_blank"><u>Políticas de Privacidad</u></a> y los <a className="highlight" href="/html/termsandconditions.html" style={{ textDecoration: 'none' }} target="_blank"><u>Términos de Uso</u></a>. Si tiene alguna consulta o duda, comuníquese a  <a className="highlight" href="mailto:contact@ivanluna.dev">contact@ivanluna.dev</a>.
                                    </p>
                                </div>
                            )}

                            <div id="down">
                                <svg id="downIcon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" width="20" onClick={handleScrollDown}>
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
                                He Leído, entendido, y aceptado las <a className="highlight" href="/html/privacypolicy.html" target="_blank"><b>Políticas de  Privacidad</b></a> y <a className="highlight" href="/html/termsandconditions.html" target="_blank"><b>Términos de Uso</b></a>
                            </label>
                        </div>
                        <button
                            onClick={handleSpotifyLogin}
                            className={`button-spotify-login ${acceptedTerms ? '' : 'disabled'}`}
                            disabled={!acceptedTerms}
                        >
                            Iniciar sesión con Spotify
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AuthenticationComponent;