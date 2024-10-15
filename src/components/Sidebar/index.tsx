import {
  CheckImg,
  DeleteImg,
  EditImg,
  Header,
  List,
  ListWrapper,
  Wrapper,
} from './style';
import { SheetNmINF } from '../../types/types';
import { deleteSheet, updateSheetProperties } from '../../apis/spreadApi';
import { useState } from 'react';

const Sidebar = ({
  sheets,
  setSheets,
  setOpen,
  handleGetSheetNm,
  handleLeagueClick,
}: {
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
    title: string
  ) => {
    e.stopPropagation();
    setSheets((preSheets) =>
      preSheets.map((item) => {
        return { ...item, edit: item.title === title };
      })
    );
    setEditTitle(title);
  };

  const handleSave = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();

    await updateSheetProperties(id, editTitle);
    await handleGetSheetNm(activeSheetsIndex);
    setEditTitle('');
  };

  const handleDelete = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    id: number
  ) => {
    e.stopPropagation();

    await deleteSheet(id);
    await handleGetSheetNm(activeSheetsIndex);
  };

  const handleImg = (sheet: SheetNmINF) => {
    const { id, active, edit } = sheet;
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
      <Header>
        <p>League Name</p>
        <img src="./images/plus.png" onClick={() => setOpen(true)} />
      </Header>
      <ListWrapper>
        {sheets.slice(3).map((sheet) => (
          <List
            onClick={() => handleLeagueClick(sheet.title)}
            active={sheet.active}
          >
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
          </List>
        ))}
      </ListWrapper>
    </Wrapper>
  );
};

export default Sidebar;
