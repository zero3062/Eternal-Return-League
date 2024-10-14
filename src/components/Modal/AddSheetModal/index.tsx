import { useEffect, useState } from 'react';
import { fetchSheetNm } from '../../../apis/spreadApi';
import Modal from '../Modal';
import {
  Button,
  Checkbox,
  CheckboxGroup,
  Content,
  Header,
  Input,
} from './style';

const AddSheetModal = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
}) => {
  const [options, setOptions] = useState<
    { id: number; title: string; active: boolean }[]
  >([]);

  const handleGetSheetNm = async () => {
    const response = await fetchSheetNm();
    setOptions(
      response.filter((option: any) => option.title.includes('Sample')),
    );
  };

  const handleCheckOption = (id: number) => {
    setOptions((preOptions) =>
      preOptions.map((option: any) => {
        return { ...option, active: option.id === id };
      }),
    );
  };

  const handleClose = (open: boolean) => {
    setOpen(open);
    handleCheckOption(0);
  };

  useEffect(() => {
    handleGetSheetNm();
  }, []);

  if (!open) return null;

  return (
    <Modal setOpen={handleClose}>
      <Content>
        <Header>Create Sheet</Header>
        <Input type="text" placeholder="Enter the Sheet Name..." />
        <CheckboxGroup>
          {options.map((option) => (
            <Checkbox>
              <input
                type="checkbox"
                id={String(option.id)}
                checked={option.active}
                onChange={() => handleCheckOption(option.id)}
              />
              <label htmlFor={String(option.id)}>{option.title}</label>
            </Checkbox>
          ))}
        </CheckboxGroup>
        <Button>CONFIRM</Button>
      </Content>
    </Modal>
  );
};

export default AddSheetModal;
