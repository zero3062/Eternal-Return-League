import React from 'react';
import {
  CheckImg,
  DeleteImg,
  EditImg,
  Header,
  List,
  ListHeader,
  ListWrapper,
  Wrapper,
} from './style';
import { RoundINF, SheetNmINF } from '../../types/types';
import { deleteSheet, updateSheetProperties } from '../../apis/spreadApi';
import { useState } from 'react';

const Round = ({
  sheet,
  rounds,
  setRounds,
}: {
  sheet?: SheetNmINF;
  rounds: RoundINF[];
  setRounds: React.Dispatch<React.SetStateAction<RoundINF[]>>;
}) => {
  const handleRoundClick = (title: string) => {
    setRounds((preRounds) =>
      preRounds.map((item) => {
        return { ...item, active: item.title === title };
      }),
    );
  };

  // const handleDelete = async (
  //   e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  //   id: number,
  // ) => {
  //   e.stopPropagation();

  //   await deleteSheet(id);
  //   await handleGetSheetNm(activeSheetsIndex);
  // };

  if (!sheet || !rounds) return null;

  return (
    <Wrapper>
      <Header>
        <p>Round</p>
        {sheet.isRoundAdd && <img src="./images/plus.png" onClick={() => {}} />}
      </Header>
      <ListWrapper>
        {rounds.map((round, index) => (
          <List
            onClick={() => handleRoundClick(round.title)}
            active={round.active}
          >
            <ListHeader>
              <p>{round.title}</p>
              {sheet.isRoundAdd &&
                !round.active &&
                index === rounds.length - 1 && (
                  <DeleteImg src="./images/delete.png" />
                )}
            </ListHeader>
          </List>
        ))}
      </ListWrapper>
    </Wrapper>
  );
};

export default Round;
