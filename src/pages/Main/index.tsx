import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getRound } from '../../api/apis/spreadApi';
import { Sidebar, AddSheetModal, Round, Table } from '../../components';
import { Wrapper, Content, Welcome } from './style';
import { RoundINF } from '../../types/types';
import useAuth from '../../hooks/useAuth';
import io from 'socket.io-client';
import useSidebar from '../../hooks/useSidbar';

// const socket = io.connect('http://localhost:8080');

const socket = io.connect('https://eternal-return-league-server.onrender.com/');

const Main = () => {
  const { sheetId, round } = useParams();
  const { accessToken, handleLogOut, handleLogin } = useAuth();

  const {
    sheets,
    sheetInfo,
    sheetNm,
    setSheetNm,
    handleGetSheets,
    handleSelectSheet,
    handleSheetEdit,
    handleSheetNmSave,
    handleSheetDelete,
  } = useSidebar();

  const [open, setOpen] = useState(false);
  const [rounds, setRounds] = useState<RoundINF[]>([]);

  const handleGetRound = async (round?: string) => {
    if (sheetInfo) {
      const response = await getRound(sheetInfo.title);
      const roundCnt = Math.ceil(response[0].length / 3);
      setRounds([
        { title: 'TOTAL', active: false },
        ...Array.from({ length: roundCnt }).map((_, index) => ({
          title: `ROUND ${index + 1}`,
          active: false,
        })),
      ]);

      handleRoundClick(round ?? 'TOTAL');
    }
  };

  const handleRoundClick = async (title: string) => {
    setRounds((preRounds) =>
      preRounds.map((item) => {
        return { ...item, active: item.title === title };
      }),
    );
  };

  useEffect(() => {
    if (sheetId) {
      setRounds([]);
      handleGetRound();
    }
  }, [sheetId]);

  return (
    <Wrapper>
      <Content>
        <Sidebar
          sheets={sheets}
          sheetNm={sheetNm}
          setSheetNm={setSheetNm}
          handleGetSheets={handleGetSheets}
          handleSelectSheet={handleSelectSheet}
          handleSheetEdit={handleSheetEdit}
          handleSheetNmSave={handleSheetNmSave}
          handleSheetDelete={handleSheetDelete}
        />
        {!sheetId && (
          <Welcome>
            <p>Welcome to Eternal Return League. </p>
            <p>You can view or edit statistics for each competition.</p>
          </Welcome>
        )}
        {sheetInfo && (
          <>
            {/* <Round
              accessToken={accessToken}
              sheetInfo={sheetInfo}
              rounds={rounds}
              handleGetRound={handleGetRound}
              handleRoundClick={handleRoundClick}
              socket={socket}
            /> */}
            {/* <Table
              accessToken={accessToken}
              sheet={sheets.find((sheet) => sheet.active)}
              round={rounds.find((round) => round.active)}
              socket={socket}
            /> */}
          </>
        )}
      </Content>
      {/* <AddSheetModal
        open={open}
        setOpen={setOpen}
        sheets={sheets}
        handleGetSheetNm={handleGetSheets}
      /> */}
    </Wrapper>
  );
};

export default Main;
