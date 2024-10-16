import React, { useEffect, useState } from 'react';
import { fetchSheetNm, getRound } from '../../apis/spreadApi';
import { Sidebar, AddSheetModal } from '../../components';
import { Wrapper, Table, Content } from './style';
import { SheetNmINF } from '../../types/types';

const Main = () => {
  const [open, setOpen] = useState(false);
  const [sheets, setSheets] = useState<SheetNmINF[]>([]);
  const [round, setRound] = useState<number[][]>([]);

  const handleLeagueClick = (title: string) => {
    setSheets((preSheets) =>
      preSheets.map((item) => {
        return { ...item, active: item.title === title, edit: false };
      }),
    );
    handleGetData(title);
  };

  const handleGetSheetNm = async (index: number) => {
    const response = await fetchSheetNm();
    setSheets(response);

    const select =
      index === -1 ? response[response.length - 1] : response[index];

    handleLeagueClick(select.title);
  };

  const handleGetData = async (title: string) => {
    const response = await getRound(title);
    setRound(response);
  };

  useEffect(() => {
    handleGetSheetNm(3);
  }, []);

  return (
    <Wrapper>
      <Content>
        <Sidebar
          sheets={sheets}
          setSheets={setSheets}
          setOpen={setOpen}
          handleGetSheetNm={handleGetSheetNm}
          handleLeagueClick={handleLeagueClick}
        />
        {round.length !== 0 && (
          <Table>
            <table>
              <thead>
                <tr>
                  {Array.from({ length: round[0].length / 2 }).map(
                    (_, index) => (
                      <th key={index} colSpan={2}>
                        Round {index + 1}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {round.map((row: number[], rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell: number, colIndex: number) => (
                      <td key={colIndex}>
                        <input readOnly type="text" value={cell || ''} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        )}
      </Content>
      <AddSheetModal
        open={open}
        setOpen={setOpen}
        sheets={sheets}
        handleGetSheetNm={handleGetSheetNm}
      />
    </Wrapper>
  );
};

export default Main;
