import { OAuthClientId } from '../config';

const REDIRECT_URI = 'https://zero3062.github.io/Eternal-Return-League/';
const SCOPE = 'https://www.googleapis.com/auth/spreadsheets';

export const handleLogin = () => {
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${OAuthClientId}&redirect_uri=${REDIRECT_URI}&response_type=token&scope=${SCOPE}`;
  window.location.href = authUrl;
};

export const fetchAccessToken = () => {
  const hash = window.location.hash;
  const token: string = hash.split('&')[0].split('=')[1];
  if (token) {
    localStorage.setItem('access_token', token);
    window.location.hash = ''; // URL에서 해시 제거
  }
};
