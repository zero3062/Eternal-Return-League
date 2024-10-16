import React from 'react';
import {
  DeleteImg,
  Header,
  List,
  ListHeader,
  ListWrapper,
  Wrapper,
} from './style';
import { RoundINF, SheetNmINF } from '../../types/types';
import { addRound, deleteRound } from '../../apis/spreadApi';
import useRange from '../../hooks/useRange';

const Round = ({
  sheet,
  rounds,
  setRounds,
  handleGetRound,
}: {
  sheet?: SheetNmINF;
  rounds: RoundINF[];
  setRounds: React.Dispatch<React.SetStateAction<RoundINF[]>>;
  handleGetRound: (title: string) => void;
}) => {
  const { getRangeByNumber } = useRange();

  const handleRoundClick = (title: string) => {
    setRounds((preRounds) =>
      preRounds.map((item) => {
        return { ...item, active: item.title === title };
      }),
    );
  };

  const handleAddRound = async () => {
    if (!sheet) return;

    const newRound = rounds.length;
    const range = getRangeByNumber(newRound);
    const values = [[`${newRound} Round`]];

    await addRound(sheet, range, values);
    await handleGetRound(sheet.title);
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    index: number,
  ) => {
    e.stopPropagation();
    if (!sheet) return;

    const range = getRangeByNumber(index, true);

    await deleteRound(sheet, range);
    await handleGetRound(sheet.title);
  };

  if (!sheet) return null;

  return (
    <Wrapper>
      <Header>
        <p>Round</p>
        {sheet.isRoundAdd && rounds.length !== 0 && (
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
                {sheet.isRoundAdd &&
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
