import { useEffect, useState } from 'react';
import { OAuthClientId } from '../config';

const REDIRECT_URI = 'http://localhost:3000';
// const REDIRECT_URI = 'https://zero3062.github.io/Eternal-Return-League';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

const useAuth = () => {
  const [accessToken, setAccessToken] = useState<string>('');

  const handleLogOut = () => {
    localStorage.removeItem('access_token');
    setAccessToken('');
  };

  const handleLogin = () => {
    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${OAuthClientId}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;
    window.location.href = authUrl;
  };

  useEffect(() => {
    const value: string | null = localStorage.getItem('access_token');
    if (value) {
      setAccessToken(value);
    } else {
      setAccessToken('');
    }
  }, [localStorage]);

  return {
    accessToken,
    handleLogOut,
    handleLogin,
  };
};

export default useAuth;
