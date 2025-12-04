import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

// Temas disponibles de equipos argentinos
export const TEAM_THEMES = {
  default: {
    name: 'Por Defecto',
    primary: '#10b981',
    secondary: '#059669',
    accent: '#34d399'
  },
  boca: {
    name: 'Boca Juniors',
    primary: '#003D7A',
    secondary: '#FFD100',
    accent: '#003D7A'
  },
  central: {
    name: 'Rosario Central',
    primary: '#003D7A',
    secondary: '#FFD100',
    accent: '#003D7A'
  },
  river: {
    name: 'River Plate',
    primary: '#E4002B',
    secondary: '#FFFFFF',
    accent: '#E4002B'
  },
  estudiantes: {
    name: 'Estudiantes',
    primary: '#E4002B',
    secondary: '#FFFFFF',
    accent: '#E4002B'
  },
  independiente: {
    name: 'Independiente',
    primary: '#E30613',
    secondary: '#E30613',
    accent: '#C00010'
  },
  racing: {
    name: 'Racing Club',
    primary: '#87CEEB',
    secondary: '#FFFFFF',
    accent: '#6BB6E0'
  },
  sanlorenzo: {
    name: 'San Lorenzo',
    primary: '#003F87',
    secondary: '#ED1C24',
    accent: '#003F87'
  },
  velez: {
    name: 'Vélez Sarsfield',
    primary: '#005EB8',
    secondary: '#FFFFFF',
    accent: '#004C9A'
  },
  newells: {
    name: "Newell's Old Boys",
    primary: '#E4002B',
    secondary: '#000000',
    accent: '#C00020'
  }
};

export const ThemeProvider = ({ children }) => {
  // Cargar tema guardado del localStorage
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });

  const [currentTeamTheme, setCurrentTeamTheme] = useState(() => {
    const saved = localStorage.getItem('teamTheme');
    return saved || 'default';
  });

  // Aplicar clase dark al HTML cuando cambia el modo
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', JSON.stringify(isDarkMode));
  }, [isDarkMode]);

  // Aplicar variables CSS del tema de equipo
  useEffect(() => {
    const theme = TEAM_THEMES[currentTeamTheme];
    if (theme) {
      document.documentElement.style.setProperty('--color-primary', theme.primary);
      document.documentElement.style.setProperty('--color-secondary', theme.secondary);
      document.documentElement.style.setProperty('--color-accent', theme.accent);
    }
    localStorage.setItem('teamTheme', currentTeamTheme);
  }, [currentTeamTheme]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  const changeTeamTheme = (themeKey) => {
    if (TEAM_THEMES[themeKey]) {
      setCurrentTeamTheme(themeKey);
    }
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    currentTeamTheme,
    changeTeamTheme,
    availableThemes: TEAM_THEMES
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme debe usarse dentro de ThemeProvider');
  }
  return context;
};
