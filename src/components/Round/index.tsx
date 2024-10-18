import React, { useEffect } from 'react';
import {
  DeleteImg,
  Header,
  List,
  ListHeader,
  ListWrapper,
  Wrapper,
} from './style';
import { RoundINF, SheetNmINF } from '../../types/types';
import { addRound, deleteRound } from '../../api/apis/spreadApi';
import useRange from '../../hooks/useRange';

const Round = ({
  accessToken,
  sheetInfo,
  rounds,
  handleGetRound,
  handleRoundClick,
  socket,
}: {
  accessToken: string;
  sheetInfo: SheetNmINF;
  rounds: RoundINF[];
  handleGetRound: (round?: string) => void;
  handleRoundClick: (title: string) => void;
  socket: any;
}) => {
  const { getRangeByNumber } = useRange();

  const handleAddRound = async () => {
    if (!sheetInfo) return;

    const newRound = rounds.length;
    const range = getRangeByNumber(newRound);
    const values = [[`${newRound} Round`]];

    const activeRound = rounds.find((round) => round.active);

    await addRound(sheetInfo, range, values, newRound);
    await handleGetRound(activeRound ? activeRound.title : 'TOTAL');
    socket.emit('send_message', {
      sheetId: sheetInfo.id,
      type: 'addRound',
    });
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    index: number,
  ) => {
    e.stopPropagation();
    if (!sheetInfo) return;

    const range = getRangeByNumber(index, true);

    const activeRound = rounds.find((round) => round.active);

    await deleteRound(sheetInfo, range, index - 1);
    await handleGetRound(activeRound ? activeRound.title : 'TOTAL');
    socket.emit('send_message', {
      sheetId: sheetInfo.id,
      roundTitle: `ROUND ${index}`,
      type: 'deleteRound',
    });
  };

  useEffect(() => {
    if (sheetInfo) {
      socket.on('receive_message', (data: any) => {
        const activeRound = rounds.find((round) => round.active);
        const { sheetId, roundTitle, type } = data;
        if (sheetId === sheetInfo?.id && activeRound) {
          if (type === 'deleteRound') {
            handleGetRound(
              activeRound.title === roundTitle ? 'TOTAL' : activeRound.title,
            );
          }

          if (type === 'addRound') {
            handleGetRound(activeRound.title);
          }
        }
      });
    }
  }, [socket, sheetInfo, rounds]);

  if (!sheetInfo) return null;

  return (
    <Wrapper>
      <Header>
        <p>Round</p>
        {accessToken && sheetInfo.isRoundAdd && rounds.length !== 0 && (
          <img
            src="./images/plus.png"
            onClick={() => {
              handleAddRound();
            }}
          />
        )}
      </Header>
      <ListWrapper>
        {rounds.length === 0 && <List active={false}>Loading...</List>}
        {rounds.length !== 0 &&
          rounds.map((round, index) => (
            <List
              onClick={() => handleRoundClick(round.title)}
              active={round.active}
            >
              <ListHeader>
                <p>{round.title}</p>
                {accessToken &&
                  sheetInfo.isRoundAdd &&
                  !round.active &&
                  index > 4 &&
                  index === rounds.length - 1 && (
                    <DeleteImg
                      src="./images/delete.png"
                      onClick={(e) => handleDelete(e, index)}
                    />
                  )}
              </ListHeader>
            </List>
          ))}
      </ListWrapper>
    </Wrapper>
  );
};

export default Round;
