import React, { useEffect, useState } from 'react';
import { fetchSheetNm, getRound } from '../../apis/spreadApi';
import { Sidebar, AddSheetModal, Round } from '../../components';
import { Wrapper, Table, Content } from './style';
import { RoundINF, SheetNmINF } from '../../types/types';

const Main = () => {
  const [open, setOpen] = useState(false);
  const [sheets, setSheets] = useState<SheetNmINF[]>([]);
  const [rounds, setRounds] = useState<RoundINF[]>([]);

  const handleLeagueClick = (title: string) => {
    setSheets((preSheets) =>
      preSheets.map((item) => {
        return { ...item, active: item.title === title, edit: false };
      }),
    );
    handleGetRound(title);
  };

  const handleGetSheetNm = async (index: number) => {
    const response = await fetchSheetNm();
    setSheets(response);

    const select =
      index === -1 ? response[response.length - 1] : response[index];

    handleLeagueClick(select.title);
  };

  const handleGetRound = async (title: string) => {
    const response = await getRound(title);
    const roundCnt = Math.ceil(response[0].length / 2);
    setRounds([
      {
        title: 'TOTAL',
        active: true,
      },
      ...Array.from({ length: roundCnt }).map((_, index) => ({
        title: `ROUND ${index + 1}`,
        active: false,
      })),
    ]);
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
        <Round
          sheet={sheets.find((sheet) => sheet.active)}
          rounds={rounds}
          setRounds={setRounds}
        />
        {/* {round.length !== 0 && (
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
        )} */}
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
