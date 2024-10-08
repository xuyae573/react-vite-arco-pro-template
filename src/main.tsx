import './style/global.less';
import React, { useEffect } from 'react';
import { createRoot } from 'react-dom/client'; // Import createRoot

import { ConfigProvider } from '@arco-design/web-react';
import enUS from '@arco-design/web-react/es/locale/en-US';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useGlobalStore } from './store';
import PageLayout from './layout';
import { GlobalContext } from './context';
import Login from './pages/login';
import checkLogin from './utils/checkLogin';
import changeTheme from './utils/changeTheme';
import useStorage from './utils/useStorage';
import './mock'; // Assuming this is for mock data

function Index() {
  const [lang, setLang] = useStorage('arco-lang', 'en-US');
  const [theme, setTheme] = useStorage('arco-theme', 'light');

  function getArcoLocale() {
    switch (lang) {
      case 'en-US':
        return enUS;
      default:
        return enUS;
    }
  }

  function fetchUserInfo() {
    const { updateUserInfo } = useGlobalStore.getState(); // Direct access to store

    // Start loading
    updateUserInfo({}, true);

    // Fetch user data from API
    axios.get('/api/user/userInfo').then((res) => {
      // Update the store with the fetched userInfo and set loading to false
      updateUserInfo(res.data, false);
    });
  }

  useEffect(() => {
    if (checkLogin()) {
      fetchUserInfo();
    } else if (window.location.pathname.replace(/\//g, '') !== 'login') {
      window.location.pathname = '/login';
    }
  }, []);

  useEffect(() => {
    changeTheme(theme);
  }, [theme]);

  const contextValue = {
    lang,
    setLang,
    theme,
    setTheme,
  };

  return (
    <BrowserRouter>
      <ConfigProvider
        locale={getArcoLocale()}
        componentConfig={{
          Card: {
            bordered: false,
          },
          List: {
            bordered: false,
          },
          Table: {
            border: false,
          },
        }}
      >
        <GlobalContext.Provider value={contextValue}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={<Navigate to="/dashboard/workplace" replace />}
            />
            <Route path="/*" element={<PageLayout />} />
          </Routes>
        </GlobalContext.Provider>
      </ConfigProvider>
    </BrowserRouter>
  );
}

const container = document.getElementById('root');

// Ensure the container exists before creating the root
if (container) {
  const root = createRoot(container); // Use createRoot from React 18
  root.render(<Index />); // Render the main component using createRoot
} else {
  console.error('Root container not found!');
}
