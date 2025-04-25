import React from 'react';
import { useTheme } from '../ThemeContext';

function MyComponent() {
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <div>
      <button onClick={toggleTheme}>
        {isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
      </button>
    </div>
  );
}

export default MyComponent;
