import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { fetchAccessToken } from './api/apis/authApi';
import { Main } from './pages';

function App() {
  useEffect(() => {
    fetchAccessToken();
  }, []);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/:sheetId" element={<Main />} />
          <Route path="/:sheetId/:round" element={<Main />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
