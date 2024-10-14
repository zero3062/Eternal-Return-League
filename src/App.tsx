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

  // return (
  //   <div className="App">
  //     <label>시트 이름</label>
  //     <input
  //       value={sheetNm}
  //       onChange={(e) => setSheetNm(e.target.value)}
  //       placeholder="시트 이름을 입력해주세요"
  //     />
  //     {sheets.slice(0, 3).map((sheet) => (
  //       <button onClick={() => handleCreateSheet(sheet.id)}>
  //         {sheet.title} 시트 추가
  //       </button>
  //     ))}
  //     <ul>
  //       {sheets.slice(3).map((sheet) => (
  //         <li onClick={() => handleGetData(sheet.title)}>{sheet.title}</li>
  //       ))}
  //     </ul>
  //     <table>
  //       <tbody>
  //         {data.map((row: any, rowIndex) => (
  //           <tr key={rowIndex}>
  //             {row.map((cell: any, colIndex: number) => (
  //               <td key={colIndex}>
  //                 <input readOnly type="text" value={cell || ''} />
  //               </td>
  //             ))}
  //           </tr>
  //         ))}
  //       </tbody>
  //     </table>
  //   </div>
  // );
}

export default App;
