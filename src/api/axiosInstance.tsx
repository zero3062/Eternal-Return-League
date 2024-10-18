import { spreadsheetApi, spreadsheetApikey, spreadsheetDocId } from '../config';
import axios from 'axios';

const accessToken = localStorage.getItem('access_token');

const deafultInstance = axios.create({
  baseURL: `${spreadsheetApi}${spreadsheetDocId}?key=${spreadsheetApikey}`,
});

const updateInstance = axios.create({
  baseURL: `${spreadsheetApi}${spreadsheetDocId}:batchUpdate?key=${spreadsheetApikey}`,
  headers: {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  },
});

export { deafultInstance, updateInstance };
