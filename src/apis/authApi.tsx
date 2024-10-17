export const fetchAccessToken = () => {
  const hash = window.location.hash;
  const token: string = hash.split('&')[0].split('=')[1];
  if (token) {
    localStorage.setItem('access_token', token);
    window.location.hash = ''; // URL에서 해시 제거
  }
};
