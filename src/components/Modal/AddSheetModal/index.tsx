import { useState } from 'react';
import { duplicateSheet } from '../../../apis/spreadApi';
import Modal from '../Modal';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Content,
  Header,
  Input,
} from './style';
import { SheetNmINF } from '../../../types/types';

const AddSheetModal = ({
  open,
  setOpen,
  sheets,
  handleGetSheetNm,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  sheets: SheetNmINF[];
  handleGetSheetNm: (index: number) => void;
}) => {
  const [sheetId, setSheetId] = useState<number | null>(null);
  const [sheetNm, setSheetNm] = useState('');

  const options = sheets.filter((item) => item.title.includes('Sample'));

  const handleClose = (open: boolean) => {
    setOpen(open);
    setSheetId(null);
    setSheetNm('');
  };

  const handleCreateSheet = async () => {
    if (sheets.findIndex((sheet) => sheet.title === sheetNm) !== -1) {
      setSheetNm('');
    }

    if (sheetId !== null && sheetNm !== '') {
      await duplicateSheet(sheetId, sheetNm, sheets.length);
      await handleGetSheetNm(-1);

      handleClose(false);
    }
  };

  if (!open) return null;

  return (
    <Modal setOpen={handleClose}>
      <Content>
        <Header>Create Sheet</Header>
        <Input
          type="text"
          placeholder="Enter the Sheet Name..."
          value={sheetNm}
          onChange={(e) => setSheetNm(e.target.value)}
        />
        <CheckboxGroup>
          {options.map((option) => (
            <Checkbox>
              <input
                type="checkbox"
                id={String(option.id)}
                checked={option.id === sheetId}
                onChange={() => setSheetId(option.id)}
              />
              <label htmlFor={String(option.id)}>{option.title}</label>
            </Checkbox>
          ))}
        </CheckboxGroup>
        <Button onClick={() => handleCreateSheet()}>CONFIRM</Button>
      </Content>
    </Modal>
  );
};

export default AddSheetModal;
