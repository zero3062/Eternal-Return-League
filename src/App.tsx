import React, { useEffect } from 'react';
import { fetchAccessToken } from './apis/authApi';
import { Main } from './pages';

function App() {
  useEffect(() => {
    fetchAccessToken();
  }, []);

  return <Main />;
}

export default App;
