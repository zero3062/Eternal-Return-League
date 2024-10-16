import { spreadsheetApi, spreadsheetApikey, spreadsheetDocId } from '../config';
import axios from 'axios';
import { SheetsINF } from '../types/spread';

const accessToken = localStorage.getItem('access_token');

export const getRound = async (sheet: string) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}/values/${sheet}!e3:az10?key=${spreadsheetApikey}`;
  try {
    const response = await axios.get(url);
    return response.data.values ?? [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const fetchSheetNm = async () => {
  const url = `${spreadsheetApi}${spreadsheetDocId}?key=${spreadsheetApikey}`;
  try {
    const response = await axios.get(url);
    const sheetNames = response.data.sheets.map((sheet: SheetsINF) => {
      return {
        id: sheet.properties.sheetId,
        title: sheet.properties.title,
        edit: false,
        active: false,
      };
    });
    return sheetNames;
  } catch (error) {
    console.error('Error fetching sheet names:', error);
  }
};

export const moveSheetToEnd = async (sheetId: number, sheetCnt: number) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}:batchUpdate?key=${spreadsheetApikey}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  };
  // 시트 순서 변경 요청
  const requestBody = {
    requests: [
      {
        updateSheetProperties: {
          properties: {
            sheetId: sheetId,
            index: sheetCnt + 1, // -1로 설정하면 맨 마지막으로 이동
          },
          fields: 'index',
        },
      },
    ],
  };

  try {
    await axios.post(url, requestBody, { headers });
  } catch (error) {
    console.error('시트 이동 오류:', error);
  }
};

export const duplicateSheet = async (
  sheetId: number,
  sheetNm: string,
  sheetCnt: number,
) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}:batchUpdate?key=${spreadsheetApikey}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  };
  const requestBody = {
    requests: [
      {
        duplicateSheet: {
          sourceSheetId: sheetId, // 복제할 시트 ID
          newSheetName: sheetNm, // 새 시트 이름
        },
      },
    ],
  };

  try {
    const response = await axios.post(url, requestBody, { headers });
    await moveSheetToEnd(
      response.data.replies[0].duplicateSheet.properties.sheetId,
      sheetCnt,
    );
  } catch (error) {
    console.error('Error duplicating sheet:', error);
  }
};

export const deleteSheet = async (sheetId: number) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}:batchUpdate?key=${spreadsheetApikey}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  };
  const requestBody = {
    requests: [{ deleteSheet: { sheetId } }],
  };

  try {
    await axios.post(url, requestBody, { headers });
  } catch (error) {
    console.error('Error duplicating sheet:', error);
  }
};

export const updateSheetProperties = async (
  sheetId: number,
  sheetNm: string,
) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}:batchUpdate?key=${spreadsheetApikey}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  };
  const requestBody = {
    requests: [
      {
        updateSheetProperties: {
          properties: {
            sheetId: sheetId, // 변경할 시트 ID
            title: sheetNm, // 새 시트 이름
          },
          fields: 'title',
        },
      },
    ],
  };

  try {
    await axios.post(url, requestBody, { headers });
  } catch (error) {
    console.error('Error duplicating sheet:', error);
  }
};
