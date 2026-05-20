import React from 'react';

const MainSection = ({
  subtitle = "Primera Convocatoria de Reconocimiento",
  title = "Buenas Prácticas de Seguridad Ciudadana en México",
  description = "2024–2025",
  buttonText = "Iniciar proceso",
  onButtonClick = null
}) => {
  
  return (
    <main className='section-main'>
      <div className='main-subtitle'>{subtitle}</div>
      <h1 className='main-title'>{title}</h1>
      <p className='main-description'>
         {description}
      </p>
      <button 
        onClick={onButtonClick}
        className='main-button'
      >
        {buttonText}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
      </button>
    </main>
  );
};

export default MainSection;
