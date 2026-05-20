import React from 'react';

const FooterStyles = {
  direccion: {
    fontSize: '1rem',
    fontFamily: 'Alverata, sans-serif',
  },
  telefono: {
    fontSize: '1rem',
    fontWeight: '300',
    fontFamily: 'Praxis Next',
  },
  subtitle: {
    fontSize: '1.25rem',
    fontFamily: 'Alverata, sans-serif',
  },
  footer: {
    marginBottom: '3rem',
  },
  textoFooter: {
    fontWeight: '300',
    fontSize: '1rem',
    lineHeight: '1.375',
    letterSpacing: '-.0125rem'
  }
}

const Footer = ({ 
  address = "Prolongación Paseo de Reforma 880, Lomas de Santa Fe, México, C.P. 01219, CDMX.",
  phone = "+52 (55) 5950-4000",
  tollfree = "+52 (55) 5950-4002",
  logoSrc = "https://academia.ibero.mx/wp-content/uploads/2023/11/logonegro.png",
  privacyLinks = null,
  socialLinks = null
}) => {

  const defaultPrivacyLinks = [
    { id: 1, vinculo: "Organigrama" },
    { id: 2, vinculo: "Corpus Reglamentario" },
    { id: 3, vinculo: "Comunicaciones Oficiales" },
    { id: 4, vinculo: "Patronato de la Universidad Iberoamericana | FICSAC" },
    { id: 5, vinculo: "Procuraduría de Derechos Universitarios" },
    { id: 6, vinculo: "Comité de Género" },
  ];

  const defaultSocialLinks = [
    { id: "facebook", icon: "facebook", url: "#" },
    { id: "instagram", icon: "instagram", url: "#" },
    { id: "tiktok", icon: "tiktok", url: "#" },
    { id: "youtube", icon: "youtube", url: "#" },
  ];

  const privacidad = privacyLinks || defaultPrivacyLinks;
  const socials = socialLinks || defaultSocialLinks;

  const renderSocialIcon = (iconType) => {
    switch(iconType) {
      case 'facebook':
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>;
      case 'instagram':
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>;
      case 'tiktok':
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5"></path><path d="M9 4v12"></path><path d="M11 6c2 1 4 1 4 3"></path></svg>;
      case 'youtube':
        return <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path><polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon></svg>;
      default:
        return null;
    }
  };

  return (
    <footer style={FooterStyles.footer} className="bg-[#f6f6f6] px-6 py-12 md:px-10 md:py-16 text-[#333] border-t border-gray-200">
      <div className="flex flex-col md:flex-row flex-wrap justify-between gap-10 max-w-[1200px] mx-auto">
        <div className="flex flex-col gap-4 md:flex-[1.5]">
          <img
            src={logoSrc}
            alt="Logo IBERO Negro"
            className="h-10 md:h-12 w-auto object-contain object-left mb-2 self-start"
          />
          <div className="text-[13px] leading-relaxed text-[#4a4a4a] m-0">
            <p style={FooterStyles.direccion}>{address}</p>
            <p style={FooterStyles.telefono} className="mt-4">{phone}</p>
            <p style={FooterStyles.telefono} className="mt-2">Lada nacional sin costo: {tollfree}</p>
          </div>
          <div className="flex gap-3 mt-4">
            {socials.map((social) => (
              <a
                key={social.id}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full border border-[#ccc] flex items-center justify-center cursor-pointer text-[#333] hover:bg-gray-200 transition-colors"
              >
                {renderSocialIcon(social.icon)}
              </a>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 md:flex-1">
          <div style={FooterStyles.subtitle} className="text-[16px] font-semibold text-[#1a1a1a] mb-1">Privacidad</div>
          {privacidad.map((item) => (
            <a
              key={item.id}
              href={item.url || "#"}
              style={FooterStyles.textoFooter}
              className='text-[13px] text-[#4a4a4a] hover:text-black'
            >
              {item.vinculo}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
