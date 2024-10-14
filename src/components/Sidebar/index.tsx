import { useEffect, useState } from 'react';
import { duplicateSheet, fetchSheetNm } from '../../apis/spreadApi';
import Modal from '../Modal/Modal';
import { Header, List, ListWrapper, Wrapper } from './style';

const Sidebar = ({
  handleGetData,
  setOpen,
}: {
  handleGetData: (title: string) => void;
  setOpen: (open: boolean) => void;
}) => {
  const [sheets, setSheets] = useState<
    { id: number; title: string; active: boolean }[]
  >([]);
  const [sheetNm, setSheetNm] = useState('');

  const handleLeagueClick = (title: string) => {
    setSheets((preSheets) =>
      preSheets.map((item) => {
        return { ...item, active: item.title === title };
      }),
    );
    handleGetData(title);
  };

  const handleGetSheetNm = async () => {
    const response = await fetchSheetNm();
    setSheets(response);
    handleLeagueClick(response[3].title);
  };

  const handleCreateSheet = async (id: number) => {
    await duplicateSheet(id, sheetNm, sheets.length);
    handleGetSheetNm();
    handleLeagueClick(sheetNm);

    setSheetNm('');
  };

  useEffect(() => {
    handleGetSheetNm();
  }, []);

  return (
    <Wrapper>
      <Header>
        <p>League Name</p>
        <img src="./images/plus.png" onClick={() => setOpen(true)} />
      </Header>
      {/* <label>시트 이름</label>
      <input
        value={sheetNm}
        onChange={(e) => setSheetNm(e.target.value)}
        placeholder="시트 이름을 입력해주세요"
      />
      {sheets.slice(0, 3).map((sheet) => (
        <button onClick={() => handleCreateSheet(sheet.id)}>
          {sheet.title} 시트 추가
        </button>
      ))} */}
      <ListWrapper>
        {sheets.slice(3).map((sheet) => (
          <List
            onClick={() => handleLeagueClick(sheet.title)}
            active={sheet.active}
          >
            {sheet.title}
          </List>
        ))}
      </ListWrapper>
    </Wrapper>
  );
};

export default Sidebar;
