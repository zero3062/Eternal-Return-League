import React from 'react';
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
import { SidebarINF } from '../../hooks/useSidbar';

const Sidebar = ({
  sheets,
  sheetNm,
  setSheetNm,
  handleSelectSheet,
  handleSheetEdit,
  handleSheetNmSave,
  handleSheetDelete,
}: SidebarINF) => {
  const handleImg = (sheet: SheetNmINF) => {
    const { id, active, edit } = sheet;

    return null;
    // if (!accessToken) return null;
    if (active) {
      if (edit) {
        return (
          <CheckImg
            src="./images/check.png"
            onClick={(e) => handleSheetNmSave(e, id)}
          />
        );
      }

      return (
        <EditImg
          src="./images/edit.png"
          onClick={(e) => handleSheetEdit(e, sheet.title)}
        />
      );
    }

    return (
      <DeleteImg
        src="./images/delete.png"
        onClick={(e) => handleSheetDelete(e, sheet.id)}
      />
    );
  };

  return (
    <Wrapper>
      <Content>
        <Header>
          <p>Enternal Return Match Table</p>
          {/* {accessToken && (
            <img src="./images/plus.png" onClick={() => setOpen(true)} />
          )} */}
        </Header>
        <ListWrapper>
          {sheets.slice(3).map((sheet) => (
            <List
              onClick={() => handleSelectSheet(sheet.id)}
              active={sheet.active}
            >
              <ListHeader>
                {sheet.edit ? (
                  <input
                    value={sheetNm}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => setSheetNm(e.target.value)}
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
        {/* {accessToken ? (
          <button onClick={handleLogOut}>Log out</button>
        ) : (
          <button onClick={handleLogin}>Login</button>
        )} */}
      </User>
    </Wrapper>
  );
};

export default Sidebar;
