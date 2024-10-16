import React, { useEffect, useState } from 'react';
import { fetchSheetNm, getRound } from '../../apis/spreadApi';
import {
  Sidebar,
  AddSheetModal,
  Round,
  TotalTable,
  RoundTable,
} from '../../components';
import { Wrapper, Content } from './style';
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
    setRounds(() => []);
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
    const roundCnt = Math.ceil(response[0].length / 3);
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
          handleGetRound={handleGetRound}
        />
        {rounds.length !== 0 &&
          rounds.filter((round) => round.active)[0].title === 'TOTAL' && (
            <TotalTable />
          )}
        {rounds.length !== 0 &&
          rounds.filter((round) => round.active)[0].title !== 'TOTAL' && (
            <RoundTable />
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
