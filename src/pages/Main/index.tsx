import React, { useEffect, useState } from 'react';
import { fetchSheetNm, getRound } from '../../apis/spreadApi';
import { Sidebar, AddSheetModal, Round, Table } from '../../components';
import { Wrapper, Content } from './style';
import { RoundINF, SheetNmINF } from '../../types/types';
import useAuth from '../../hooks/useAuth';
import io from 'socket.io-client';

// const socket = io.connect('http://localhost:8080');

const socket = io.connect('https://eternal-return-league-server.vercel.app/');

const Main = () => {
  const [open, setOpen] = useState(false);
  const [sheets, setSheets] = useState<SheetNmINF[]>([]);
  const [rounds, setRounds] = useState<RoundINF[]>([]);

  const { accessToken, handleLogOut, handleLogin } = useAuth();

  const handleLeagueClick = async (title: string) => {
    setSheets((preSheets) =>
      preSheets.map((item) => ({
        ...item,
        active: item.title === title,
        edit: false,
      }))
    );
    setRounds([]);
    await handleGetRound(title);
  };

  const handleGetSheetNm = async (index: number) => {
    const response = await fetchSheetNm();
    setSheets(response);

    const select =
      index === -1 ? response[response.length - 1] : response[index];

    await handleLeagueClick(select.title);
  };

  const handleGetRound = async (title: string) => {
    const response = await getRound(title);
    const roundCnt = Math.ceil(response[0].length / 3);
    setRounds([
      { title: 'TOTAL', active: false },
      ...Array.from({ length: roundCnt }).map((_, index) => ({
        title: `ROUND ${index + 1}`,
        active: false,
      })),
    ]);

    handleRoundClick('TOTAL');
  };

  const handleRoundClick = async (title: string) => {
    setRounds((preRounds) =>
      preRounds.map((item) => {
        return { ...item, active: item.title === title };
      })
    );
  };

  useEffect(() => {
    handleGetSheetNm(3);
  }, []);

  return (
    <Wrapper>
      <Content>
        <Sidebar
          accessToken={accessToken}
          handleLogOut={handleLogOut}
          handleLogin={handleLogin}
          sheets={sheets}
          setSheets={setSheets}
          setOpen={setOpen}
          handleGetSheetNm={handleGetSheetNm}
          handleLeagueClick={handleLeagueClick}
        />
        <Round
          accessToken={accessToken}
          sheet={sheets.find((sheet) => sheet.active)}
          rounds={rounds}
          handleGetRound={handleGetRound}
          handleRoundClick={handleRoundClick}
        />
        <Table
          accessToken={accessToken}
          sheet={sheets.find((sheet) => sheet.active)}
          round={rounds.find((round) => round.active)}
          socket={socket}
        />
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
