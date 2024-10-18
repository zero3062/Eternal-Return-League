import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getSheetsApi } from '../api/apis/spreadApi';
import { SheetsINF, TabColorINF } from '../types/spread';
import { SheetNmINF } from '../types/types';

export interface SidebarINF {
  sheets: SheetNmINF[];
  sheetInfo?: SheetNmINF | null;
  sheetNm: string;
  setSheetNm: React.Dispatch<React.SetStateAction<string>>;
  handleGetSheets: () => void;
  handleSelectSheet: (sheetId: number) => void;
  handleSheetEdit: (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    name: string,
  ) => void;
  handleSheetNmSave: (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    sheetId: number,
  ) => void;
  handleSheetDelete: (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    sheetId: number,
  ) => void;
}

const useSidebar = (): SidebarINF => {
  const navigate = useNavigate();
  const { sheetId } = useParams<{ sheetId: string }>();

  const [sheets, setSheets] = useState<SheetNmINF[]>([]);
  const [sheetNm, setSheetNm] = useState<string>('');

  const sheet = sheets.find((sheet) => sheet.id === Number(sheetId));
  const sheetInfo = sheet ?? null;

  // RGB -> HEX 변환 함수
  const handleToHex = (tabColor: TabColorINF) => {
    const to255 = (value: number) => Math.round(value * 255);
    const toHex = (value: number) => value.toString(16).padStart(2, '0'); // padStart로 간소화

    const { red, green, blue } = tabColor;
    return `#${toHex(to255(red))}${toHex(to255(green))}${toHex(to255(blue))}`;
  };

  // 시트 목록 가져오기
  const handleGetSheets = async () => {
    try {
      const response = await getSheetsApi();

      setSheets(
        response.map((sheet: SheetsINF) => ({
          id: sheet.properties.sheetId,
          title: sheet.properties.title,
          active: false,
          edit: false,
          isRoundAdd: handleToHex(sheet.properties.tabColor) === '#d9ead3',
        })),
      );
    } catch {
      //
    }
  };

  // 시트 선택
  const handleSelectSheet = async (sheetId: number) => {
    navigate(`/${sheetId}`);
  };

  // 시트명 수정
  const handleSheetEdit = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation();
    setSheets((preSheets) =>
      preSheets.map((sheet) => {
        return { ...sheet, edit: sheet.id === Number(sheetId) };
      }),
    );
    setSheetNm(sheetInfo ? sheetInfo.title : '');
  };

  // 시트명 저장
  const handleSheetNmSave = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
  ) => {
    e.stopPropagation();

    // await updateSheetProperties(sheetId, sheetNm);
    await handleGetSheets();
    setSheetNm('');
  };

  const handleSheetDelete = async (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>,
    sheetId: number,
  ) => {
    e.stopPropagation();

    // await deleteSheet(sheetId);
    await handleGetSheets();
  };

  useEffect(() => {
    handleGetSheets();
  }, []);

  return {
    sheets,
    sheetInfo,
    sheetNm,
    setSheetNm,
    handleGetSheets,
    handleSelectSheet,
    handleSheetEdit,
    handleSheetNmSave,
    handleSheetDelete,
  };
};

export default useSidebar;
