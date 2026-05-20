import React, { useState } from 'react';
import { Menu, X, ChevronRight, ExternalLink } from 'lucide-react';

const styles = {
  header: {
    position: 'fixed',
    width: '100%',
    zIndex: '9999'
  },
  menuNav: {
    fontSize: '1rem',
    fontFamily: 'Alverata, sans-serif',
    fontWeight: '300',
  },
  buttonHeader: {
    display: 'none',
    border: '1px solid #E00034',
    color: '#E00034',
    fontFamily: 'Praxis Next',
    fontWeight: '300',
    padding: '12px 40px'
  },
  buttonHeaderHover: {
    background: '#E00034',
    color: '#fff',
    fontFamily: 'Praxis Next',
    fontWeight: '300',
    padding: '12px 40px'
  },
  menuNavHover: {
    textDecoration: 'underline',
    fontSize: '1rem',
    fontFamily: 'Alverata, sans-serif',
    fontWeight: '300'
  },
  menuTitleMobile: {
    fontFamily: 'Alverata, sans-serif',
    fontSize: '1.3em',
    fontWeight: '500'
  },
  menuTextMobile: {
    fontWeight: '300',
    fontSize: '.9em'
  }
}

const Header = ({ 
  logoSrc = "https://academia.ibero.mx/wp-content/uploads/2023/11/logonegro.png",
  menuItems = null,
  onInfoClick = null,
  onIntranetClick = null
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [esHover, setEsHover] = useState(null);
  const [esUnderline, setEsUnderline] = useState(null);
  
  const defaultMenuItems = [
    { id: "l1", label: "Investigación", url:"https://seguridadviacivil.ibero.mx/investigacion/" },
    { id: "l2", label: "Análisis", url:"https://seguridadviacivil.ibero.mx/analisis/" },
    { id: "l3", label: "Foros", url:"https://seguridadviacivil.ibero.mx/foros/" },
    { id: "l4", label: "Acervo", url:"https://seguridadviacivil.ibero.mx/acervo/", icon: <ExternalLink size={12} /> },
    { id: "l5", label: "Agenda", url:"https://seguridadviacivil.ibero.mx/agenda-universitaria-para-la-seguridad-ciudadana-en-via-civil/", icon: <ChevronRight size={14} /> },
    { id: "l6", label: "Servicio Social", url:"https://seguridadviacivil.ibero.mx/plumas-por-la-seguridad-ciudadana/" },
    { id: "l7", label: "Buenas prácticas", url:"https://seguridadviacivil.ibero.mx/buenas-practicas/" },
  ];

  const items = menuItems || defaultMenuItems;
  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="relative bg-white ">
      {/* Top Bar for Desktop and Mobile */}
      <div className="flex justify-between items-center px-6 md:px-10 py-4 h-[100px] bg-white relative z-50">
        <div className="flex items-center">
          <img
            src={logoSrc}
            alt="Logo IBERO"
            className="h-12 md:h-9 w-auto object-contain"
          />
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden flex items-center">
          <button onClick={toggleMenu} className={isOpen ? "text-gray-500" : "text-[#d6001c]"}>
            {isOpen ? <X size={32} strokeWidth={1} color='#e00034' /> : <Menu size={32} strokeWidth={2} color='#e00034' />}
          </button>
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex gap-4">
          <button 
            style={esHover === "solicitar" ? styles.buttonHeaderHover : styles.buttonHeader} 
            onMouseEnter={() => setEsHover("solicitar")} 
            onMouseLeave={() => setEsHover(null)} 
            onClick={onInfoClick}
            className="px-6 py-2 border border-[#d6001c] rounded-full text-[#d6001c] text-sm font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors"
          >
            Solicitar Información
            <ExternalLink size={14} />
          </button>
          <button 
            style={esHover === "intranet" ? styles.buttonHeaderHover : styles.buttonHeader} 
            onMouseEnter={() => setEsHover("intranet")} 
            onMouseLeave={() => setEsHover(null)}
            onClick={onIntranetClick}
            className="px-6 py-2 border border-[#d6001c] rounded-full text-[#d6001c] text-sm font-medium hover:bg-gray-50 transition-colors"
          >
            Intranet
          </button>
        </div>
      </div>

      {/* Desktop Bottom Navigation */}
      <div className="hidden px-8 md:flex justify-start items-center px-10 gap-8 overflow-x-auto whitespace-nowrap">
        {items.map((item) => (
          <a
            key={item.id}
            href={item.url || "#"}
            style={esUnderline === item.id ? styles.menuNavHover : styles.menuNav}
            onMouseEnter={() => setEsUnderline(item.id)}
            onMouseLeave={() => setEsUnderline(null)}
            className="text-gray-800 text-sm font-medium py-4 hover:text-[#d6001c] transition-colors flex items-center gap-1"
          >
            {item.label}
            {item.icon}
          </a>
        ))}
      </div>

      {/* Mobile Expanding Menu */}
      {isOpen && (
        <div className="md:hidden absolute top-[80px] left-0 w-full bg-white z-40 flex flex-col px-6 py-6 h-[calc(100vh-80px)] overflow-y-auto">
          <h2 style={styles.menuTitleMobile} className="text-[20px] font-bold text-[#1a1a1a] mb-6">Menú</h2>

          <nav className="flex flex-col mb-8 flex-1">
            {items.map((item) => (
              <a
                key={item.id}
                href={item.url || "#"}
                style={styles.menuTextMobile}
                onMouseEnter={() => setEsUnderline(item.id)}
                onMouseLeave={() => setEsUnderline(null)}
                className='flex justify-between items-center text-[#333] text-[15px] py-4'
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex flex-col gap-3 pb-8">
            <button 
              style={esHover === "solicitarmobile" ? styles.buttonHeaderHover : styles.buttonHeader} 
              onMouseEnter={() => setEsHover("solicitarmobile")} 
              onMouseLeave={() => setEsHover(null)}
              onClick={onInfoClick}
              className="w-full py-3 border border-[#333] rounded-full text-[#333] text-[15px] font-medium flex items-center justify-center gap-2"
            >
              Solicitar información
              <ExternalLink size={16} className="text-[#333]" />
            </button>
            <button 
              style={esHover === "intranetmobile" ? styles.buttonHeaderHover : styles.buttonHeader} 
              onMouseEnter={() => setEsHover("intranetmobile")} 
              onMouseLeave={() => setEsHover(null)}
              onClick={onIntranetClick}
              className="w-full py-3 border border-[#333] rounded-full text-[#333] text-[15px] font-medium"
            >
              Intranet
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
