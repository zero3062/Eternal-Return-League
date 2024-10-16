const useRange = () => {
  const getColumnName = (index: number) => {
    let columnName = '';
    while (index >= 0) {
      columnName = String.fromCharCode((index % 26) + 97) + columnName; // a(97)부터 시작
      index = Math.floor(index / 26) - 1; // 다음 열로 넘어가기
    }
    return columnName.toUpperCase();
  };

  const getRangeByNumber = (number: number, all: boolean = false) => {
    const startColumnIndex = (number - 1) * 3 + 4; // 시작 열의 인덱스 (0부터 시작)
    const endColumnIndex = startColumnIndex + 2; // 종료 열의 인덱스

    const startColumn = getColumnName(startColumnIndex);
    const endColumn = getColumnName(endColumnIndex);

    return `${startColumn}2:${endColumn}${all ? '10' : '2'}`;
  };

  const getRoundRange = (number: number) => {
    const startColumnIndex = (number - 1) * 3 + 4; // 시작 열의 인덱스 (0부터 시작)
    const endColumnIndex = startColumnIndex + 2; // 종료 열의 인덱스

    const startColumn = getColumnName(startColumnIndex);
    const endColumn = getColumnName(endColumnIndex);

    return `${startColumn}3:${endColumn}10`;
  };

  return {
    getRangeByNumber,
    getRoundRange,
  };
};

export default useRange;
