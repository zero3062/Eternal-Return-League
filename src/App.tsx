import React, { useEffect, useState } from 'react';
import './App.css';
import { fetchAccessToken, handleLogin } from './apis/authApi';
import { duplicateSheet, fetchData, fetchSheetNm } from './apis/spreadApi';

function App() {
  const [data, setData] = useState([]);
  const [sheets, setSheets] = useState<{ id: number; title: string }[]>([]);
  const [sheetNm, setSheetNm] = useState('');

  const handleGetSheetNm = async () => {
    const response = await fetchSheetNm();
    setSheets(response);
  };

  const handleGetData = async (title: string) => {
    const response: any = await fetchData(title);
    setData(response);
  };

  const handleCreateSheet = async (id: number) => {
    await duplicateSheet(id, sheetNm, sheets.length);
    handleGetSheetNm();
    handleGetData(sheetNm);

    setSheetNm('');
  };

  useEffect(() => {
    fetchAccessToken();
    handleGetSheetNm();
  }, []);

  if (!localStorage.getItem('access_token')) {
    return <button onClick={handleLogin}>Login with Google</button>;
  }

  return (
    <div className="App">
      <h1>Point Calculator</h1>
      <label>시트 이름</label>
      <input
        value={sheetNm}
        onChange={(e) => setSheetNm(e.target.value)}
        placeholder="시트 이름을 입력해주세요"
      />
      {sheets.slice(0, 3).map((sheet) => (
        <button onClick={() => handleCreateSheet(sheet.id)}>
          {sheet.title} 시트 추가
        </button>
      ))}
      <ul>
        {sheets.slice(3).map((sheet) => (
          <li onClick={() => handleGetData(sheet.title)}>{sheet.title}</li>
        ))}
      </ul>
      <table>
        <tbody>
          {data.map((row: any, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell: any, colIndex: number) => (
                <td key={colIndex}>
                  <input readOnly type="text" value={cell || ''} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
