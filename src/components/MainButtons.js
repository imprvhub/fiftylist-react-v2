import React, { useState } from 'react';

const MainButtons = ({
  accessToken,
  topSongs,
  fetchTopSongs,
  timeRange,
  handleTimeRangeChange,
  exportShare,
}) => {
  const [showExportButtons, setShowExportButtons] = useState(false);
  const [activeButton, setActiveButton] = useState(null);

  const handleFetchTopSongs = () => {
    fetchTopSongs();
    setShowExportButtons(true);
  };

  return (
    <div className="main-button-container">
      {accessToken && (
        <>
          <div className="time-range-container">
            <div className="time-range-selector">
              <label style={{fontSize: '13px', letterSpacing: '1px' }} htmlFor="time-range" className="time-range-label">
                Seleccionar Período de Tiempo:
              </label>
              <select
                id="time-range"
                value={timeRange}
                onChange={handleTimeRangeChange}
                style={{ textAlign: 'center', fontSize: '13px'}}
                className={`time-range-select ${timeRange}`}
              >
                <option value="short_term">Último mes</option>
                <option value="medium_term">Últimos 6 meses</option>
                <option value="long_term">Todos los tiempos</option>
              </select>
            </div>
          </div>
          <div className="button-navbar">
            <button
              className="button-new"
              onClick={handleFetchTopSongs}
              onMouseEnter={() => setActiveButton('fetchButton')}
              onMouseLeave={() => setActiveButton(null)}
              style= {{ fontSize: '13px'}}
            >
              Obtener 50 tracks más escuchados
            </button>

            {showExportButtons && (
              <>
                <button
                  className={`button-new ${topSongs.length ? '' : 'disabled'}`}
                  onClick={exportShare}
                  onMouseEnter={() => setActiveButton('exportButton')}
                  onMouseLeave={() => setActiveButton(null)}
                  disabled={!topSongs.length}
                  style= {{ fontSize: '13px'}}
                >
                  Generar FiftyCard
                </button>
              </>
            )}

            <a
              href="/html/revoke.html"
              target="_blank"
              className="button-new"
              onMouseEnter={() => setActiveButton('revokeButton')}
              onMouseLeave={() => setActiveButton(null)}
              style= {{ fontSize: '13px'}}
            >
              Revocar Acceso
            </a>
          </div>
        </>
      )}
      <br></br>
    </div>
  );
};

export default MainButtons;
