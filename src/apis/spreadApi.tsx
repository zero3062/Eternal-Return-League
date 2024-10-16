import { spreadsheetApi, spreadsheetApikey, spreadsheetDocId } from '../config';
import axios from 'axios';
import { SheetsINF, TabColorINF } from '../types/spread';
import { SheetNmINF } from '../types/types';

const accessToken = localStorage.getItem('access_token');

export const getRound = async (sheet: string) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}/values/${sheet}!e2:az2?key=${spreadsheetApikey}`;
  try {
    const response = await axios.get(url);
    return response.data.values ?? [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

const handleToHex = (tabColor: TabColorINF) => {
  const { red, green, blue } = tabColor;
  const to255 = (value: number) => Math.round(value * 255);

  const toHex = (value: number) => {
    const hex = value.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };

  const r = toHex(to255(red));
  const g = toHex(to255(green));
  const b = toHex(to255(blue));

  return `#${r}${g}${b}`;
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
        isRoundAdd: handleToHex(sheet.properties.tabColor) === '#d9ead3',
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

const getRangeDetails = (range: string) => {
  // 범위에서 셀 범위 추출
  const regex = /([A-Z]+)(\d+):([A-Z]+)(\d+)/;
  const matches = range.match(regex);

  if (!matches) {
    throw new Error('Invalid range format');
  }

  const startColumn = matches[1]; // 시작 열
  const startRow = parseInt(matches[2]); // 시작 행 (문자에서 숫자로 변환)
  const endColumn = matches[3]; // 종료 열
  const endRow = parseInt(matches[4]); // 종료 행 (문자에서 숫자로 변환)

  // 열 인덱스를 숫자로 변환 (A=0, B=1, ..., Z=25, AA=26 ...)
  const getColumnIndex = (column: string) => {
    let index = 0;
    for (let i = 0; i < column.length; i++) {
      index = index * 26 + (column.charCodeAt(i) - 65 + 1);
    }
    return index - 1; // 0-based index
  };

  // 각 범위 계산
  const startColumnIndex = getColumnIndex(startColumn);
  const endColumnIndex = getColumnIndex(endColumn) + 1; // 종료 열은 exclusive로 처리

  return {
    startRowIndex: startRow - 1, // 0부터 시작하도록 조정
    endRowIndex: endRow, // 이미 exclusive 처리되므로 그대로 사용
    startColumnIndex,
    endColumnIndex,
  };
};

const mergeCells = async (
  sheetId: number, // 스프레드시트 ID
  range: string,
) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}:batchUpdate?key=${spreadsheetApikey}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  };
  const requestBody = {
    requests: [
      {
        mergeCells: {
          range: {
            sheetId: sheetId,
            ...getRangeDetails(range),
          },
          mergeType: 'MERGE_ALL', // 셀 합치기 방식
        },
      },
      {
        repeatCell: {
          range: {
            sheetId: sheetId,
            ...getRangeDetails(range),
          },
          cell: {
            userEnteredFormat: {
              horizontalAlignment: 'CENTER', // 가로 정렬을 가운데로 설정
            },
          },
          fields: 'userEnteredFormat.horizontalAlignment', // 업데이트할 필드
        },
      },
    ],
  };

  try {
    await axios.post(url, requestBody, { headers });
  } catch (error) {
    console.error('Error merging cells:', error);
  }
};

export const addRound = async (
  sheet: SheetNmINF,
  range: string,
  values: number[][] | string[][],
) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}/values/${sheet.title}!${range}:append?valueInputOption=USER_ENTERED&key=${spreadsheetApikey}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  };

  const requestBody = {
    values: values, // 추가할 데이터
  };

  try {
    await axios.post(url, requestBody, { headers });
    await mergeCells(sheet.id, range);
  } catch (error) {
    console.error('Error appending data to sheet:', error);
  }
};

export const deleteRound = async (sheet: SheetNmINF, range: string) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}:batchUpdate?key=${spreadsheetApikey}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  };
  const requestBody = {
    requests: [
      {
        deleteRange: {
          range: {
            sheetId: sheet.id,
            ...getRangeDetails(range),
          },
          shiftDimension: 'ROWS',
        },
      },
    ],
  };

  try {
    await axios.post(url, requestBody, { headers });
  } catch (error) {
    console.error('Error deleting range:', error);
  }
};

export const getTotalData = async (sheet: string) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}/values/${sheet}!a14:d21?key=${spreadsheetApikey}`;
  try {
    const response = await axios.get(url);
    return response.data.values ?? [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getTeamData = async (sheet: string) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}/values/${sheet}!A3:A10?key=${spreadsheetApikey}`;
  try {
    const response = await axios.get(url);
    return response.data.values ?? [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};

export const getRoundData = async (sheet: string, range: string) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}/values/${sheet}!${range}?key=${spreadsheetApikey}`;
  try {
    const response = await axios.get(url);
    return response.data.values ?? [];
  } catch (error) {
    console.error('Error fetching data:', error);
  }
};
