export interface TabColorINF {
  red: number;
  green: number;
  blue: number;
}

export interface SheetsINF {
  properties: {
    sheetId: number;
    title: string;
    tabColor: TabColorINF;
  };
}
