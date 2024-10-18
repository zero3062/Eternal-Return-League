import {
  spreadsheetApi,
  spreadsheetApikey,
  spreadsheetDocId,
} from '../../config';
import axios from 'axios';
import { SheetNmINF } from '../../types/types';
import { deafultInstance } from '../axiosInstance';

const accessToken = localStorage.getItem('access_token');

// 시트 목록 가져오기 api
export const getSheetsApi = async () => {
  try {
    const response = await deafultInstance({
      url: '',
      method: 'GET',
    });

    return response.data.sheets;
  } catch (err) {
    //
  }
};

export const getRound = async (sheet: string) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}/values/${sheet}!e2:az2?key=${spreadsheetApikey}`;
  try {
    const response = await axios.get(url);
    return response.data.values ?? [];
  } catch (error) {
    console.error('Error fetching data:', error);
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
  newRound: number,
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
    await handleFormula(sheet.title, newRound);
  } catch (error) {
    console.error('Error appending data to sheet:', error);
  }
};

export const deleteRound = async (
  sheet: SheetNmINF,
  range: string,
  thisRound: number,
) => {
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
    await handleFormula(sheet.title, thisRound);
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

export const updateCellFormula = async (
  sheet: string,
  range: string, // 예: "A1"
  formula: string, // 예: "=SUM(E4,H4,K4,N4,Q4,T4,W4,Y4)"
) => {
  const url = `${spreadsheetApi}${spreadsheetDocId}/values/${sheet}!${range}?valueInputOption=USER_ENTERED&key=${spreadsheetApikey}`;
  const headers = {
    Authorization: `Bearer ${accessToken}`, // OAuth 2.0 액세스 토큰
  };
  const body = {
    range: `${sheet}!${range}`,
    majorDimension: 'ROWS',
    values: [[formula]],
  };

  try {
    await axios.put(url, body, { headers });
  } catch (error) {
    console.error('Error updating cell formula:', error);
  }
};

const handleFormula = async (sheet: string, newRound: number) => {
  const indexToColumn = (index: number) => {
    let col = '';
    while (index >= 0) {
      col = String.fromCharCode((index % 26) + 65) + col;
      index = Math.floor(index / 26) - 1;
    }
    return col;
  };

  // 동적으로 열 이름을 생성하는 함수
  const generateColumnNames = (start = 'E', step = 3, count: number) => {
    const startIndex = start.charCodeAt(0) - 65; // 'E'의 인덱스 (4)
    return Array.from({ length: count }, (_, i) =>
      indexToColumn(startIndex + i * step),
    );
  };

  // 수식을 생성하는 함수
  const totalKillColumn = generateColumnNames('E', 3, newRound); // 동적으로 열 생성
  const totalKillExpression = totalKillColumn
    .map((col) => `${col}3:${col}10`)
    .join(' + ');

  updateCellFormula(
    sheet,
    'B3',
    `=ARRAYFORMULA(IF(${totalKillExpression}, ${totalKillExpression}, 0))`,
  );

  const DeathNonPlayerColumn = generateColumnNames('G', 3, newRound); // 동적으로 열 생성
  const DeathNonPlayerExpression = DeathNonPlayerColumn.map(
    (col) => `${col}3:${col}10`,
  ).join(' + ');

  updateCellFormula(
    sheet,
    'D3',
    `=ARRAYFORMULA(IF(${DeathNonPlayerExpression}, ${DeathNonPlayerExpression}, 0))`,
  );

  const TotalPointColumn = generateColumnNames('F', 3, newRound); // 동적으로 열 생성
  const TotalPointExpression = TotalPointColumn.map(
    (col) =>
      `SWITCH(${col}3:${col}10, 1, 8, 2, 5, 3, 4, 4, 3, 5, 2, 6, 1, 7, 0, 8, 0, 0)`,
  ).join(' + ');

  updateCellFormula(
    sheet,
    'C3',
    `=ARRAYFORMULA(IF(B3:B10 + ${TotalPointExpression} - D3:D10, B3:B10 + ${TotalPointExpression} - D3:D10, 0))`,
  );

  const RankColumn = generateColumnNames('F', 3, newRound); // 동적으로 열 생성
  const RankExpression = RankColumn.reverse()
    .map((col) => `${col}3:${col}10, true`)
    .join(', ');

  updateCellFormula(
    sheet,
    'B14',
    `=SORT(A3:A10, C3:C10, FALSE, B3:B10, FALSE, ${RankExpression})`,
  );

  updateCellFormula(
    sheet,
    'C14',
    `=SORT(B3:B10, C3:C10, FALSE, B3:B10, FALSE, ${RankExpression})`,
  );

  updateCellFormula(
    sheet,
    'D14',
    `=SORT(C3:C10, C3:C10, FALSE, B3:B10, FALSE, ${RankExpression})`,
  );
};
