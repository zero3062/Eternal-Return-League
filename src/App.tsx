import { useEffect } from 'react';
import { fetchAccessToken } from './apis/authApi';
import { Login, Main } from './pages';

function App() {
  useEffect(() => {
    fetchAccessToken();
  }, []);

  if (!localStorage.getItem('access_token')) {
    return <Login />;
  }

  return <Main />;
}

export default App;
