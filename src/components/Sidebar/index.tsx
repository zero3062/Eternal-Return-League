import React, { useState } from 'react';
import {
  CheckImg,
  Content,
  DeleteImg,
  EditImg,
  Header,
  List,
  ListHeader,
  ListWrapper,
  User,
  Wrapper,
} from './style';
import { SheetNmINF } from '../../types/types';
import { deleteSheet, updateSheetProperties } from '../../apis/spreadApi';

const Sidebar = ({
  accessToken,
  handleLogOut,
  handleLogin,
  sheets,
  setSheets,
  setOpen,
  handleGetSheetNm,
  handleLeagueClick,
}: {
  accessToken: string;
  handleLogOut: () => void;
  handleLogin: () => void;
  sheets: SheetNmINF[];
  setSheets: React.Dispatch<React.SetStateAction<SheetNmINF[]>>;
  setOpen: (open: boolean) => void;
  handleGetSheetNm: (index: number) => void;
  handleLeagueClick: (title: string) => void;
}) => {
  const [editTitle, setEditTitle] = useState('');

  const activeSheetsIndex = sheets.findIndex((sheet) => sheet.active);

  const handleEdit = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    title: string,
  ) => {
    e.stopPropagation();
    setSheets((preSheets) =>
      preSheets.map((item) => {
        return { ...item, edit: item.title === title };
      }),
    );
    setEditTitle(title);
  };

  const handleSave = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    id: number,
  ) => {
    e.stopPropagation();

    await updateSheetProperties(id, editTitle);
    await handleGetSheetNm(activeSheetsIndex);
    setEditTitle('');
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    id: number,
  ) => {
    e.stopPropagation();

    await deleteSheet(id);
    await handleGetSheetNm(activeSheetsIndex);
  };

  const handleImg = (sheet: SheetNmINF) => {
    const { id, active, edit } = sheet;

    if (!accessToken) return null;
    if (active) {
      if (edit) {
        return (
          <CheckImg
            src="./images/check.png"
            onClick={(e) => handleSave(e, id)}
          />
        );
      }

      return (
        <EditImg
          src="./images/edit.png"
          onClick={(e) => handleEdit(e, sheet.title)}
        />
      );
    }

    return (
      <DeleteImg
        src="./images/delete.png"
        onClick={(e) => handleDelete(e, sheet.id)}
      />
    );
  };

  return (
    <Wrapper>
      <Content>
        <Header>
          <p>League Name</p>
          {accessToken && (
            <img src="./images/plus.png" onClick={() => setOpen(true)} />
          )}
        </Header>
        <ListWrapper>
          {sheets.slice(3).map((sheet) => (
            <List
              onClick={() => handleLeagueClick(sheet.title)}
              active={sheet.active}
            >
              <ListHeader>
                {sheet.edit ? (
                  <input
                    value={editTitle}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setEditTitle(e.target.value)}
                  />
                ) : (
                  <p>{sheet.title}</p>
                )}
                {handleImg(sheet)}
              </ListHeader>
            </List>
          ))}
        </ListWrapper>
      </Content>
      <User>
        {accessToken ? (
          <button onClick={handleLogOut}>Log out</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )}
      </User>
    </Wrapper>
  );
};

export default Sidebar;
