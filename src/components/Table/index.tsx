import React, { useEffect, useState } from 'react';
import {
  getRoundData,
  getTeamData,
  getTotalData,
  updateCellFormula,
} from '../../apis/spreadApi';
import useRange from '../../hooks/useRange';
import { RoundINF, SheetNmINF } from '../../types/types';
import { Tbody, Tr, Wrapper } from './style';

const Table = ({ sheet, round }: { sheet?: SheetNmINF; round?: RoundINF }) => {
  const { getRoundRange } = useRange();
  const [data, setData] = useState<(string | number)[][]>([]);

  const extractRoundNumber = (title: string): number | null => {
    const match = title.match(/\d+/); // 문자열에서 숫자만 추출
    return match ? parseInt(match[0], 10) : null;
  };

  const mergeData = (
    names: string[][],
    scores: number[][],
  ): (string | number)[][] => {
    const result: (string | number)[][] = [];

    // 4x8 테이블 초기화 (모든 값을 null로 시작)
    for (let i = 0; i < 8; i++) {
      result.push(['', '', '', '']);
    }

    // 이름 데이터 채우기
    names.forEach((name, rowIndex) => {
      if (result[rowIndex]) {
        result[rowIndex][0] = name[0] || ''; // 이름 열은 첫 번째 열에 채움
      }
    });

    // 점수 데이터 채우기
    scores.forEach((scoreRow, rowIndex) => {
      scoreRow.forEach((score, colIndex) => {
        if (result[rowIndex]) {
          result[rowIndex][colIndex + 1] = score || ''; // 두 번째 열부터 채움
        }
      });
    });

    return result;
  };

  const handleTotalData = async (title: string) => {
    const response = await getTotalData(title);

    setData(response);
  };

  const handleRoundData = async (title: string, number: number | null) => {
    if (number) {
      const teamData = await getTeamData(title);
      const response = await getRoundData(title, getRoundRange(number));

      setData(mergeData(teamData, response));
    }
  };

  const handleGetData = async () => {
    if (sheet && round) {
      if (round.title === 'TOTAL') {
        await handleTotalData(sheet.title);
      } else {
        await handleRoundData(sheet.title, extractRoundNumber(round.title));
      }
    }
  };

  // 숫자를 알파벳으로 변환하는 함수
  const convertToAlphabet = (index: number) => {
    let result = '';
    let currentIndex = index;

    // 알파벳 변환 로직
    while (currentIndex >= 0) {
      let charCode = (currentIndex % 26) + 69; // 97은 'a'의 ASCII 코드
      result = String.fromCharCode(charCode) + result; // 앞에 추가
      currentIndex = Math.floor(currentIndex / 26) - 1; // 다음 인덱스 계산
    }

    return result;
  };

  const getAlphabetGroup = (num: number) => {
    const groupSize = 3; // 각 그룹의 크기

    if (num < 1) return []; // 유효하지 않은 숫자

    // 숫자에 따라 그룹의 시작 인덱스 계산
    const startIndex = (num - 1) * groupSize;

    // 그룹을 생성할 배열
    let group: string[] = [];

    for (let i = 0; i < groupSize; i++) {
      group.push(convertToAlphabet(startIndex + i));
    }

    return group;
  };

  const handleEdit = async (
    e: React.ChangeEvent<HTMLInputElement>,
    rowIndex: number,
    index: number,
  ) => {
    if (!sheet || !round) return;
    const value =
      index !== 0 ? e.target.value.replace(/[^0-9]/gim, '') : e.target.value;

    setData((preData) =>
      preData.map((row, rowIdx) =>
        rowIdx === rowIndex
          ? row.map((item, idx) => (idx === index ? value : item))
          : row,
      ),
    );

    const row = [
      'A',
      ...getAlphabetGroup(extractRoundNumber(round.title) ?? 0),
    ];

    await updateCellFormula(sheet.title, `${row[index]}${rowIndex + 3}`, value);
  };

  const handleCheckmate = (row: (number | string)[]) => {
    if (!sheet) return false;
    return sheet?.isRoundAdd && Number(row[3]) > 55;
  };

  useEffect(() => {
    setData([]);
    handleGetData();
  }, [sheet, round]);

  if (!sheet || !round) return null;

  if (data.length === 0) return <Wrapper>Loading...</Wrapper>;

  return (
    <Wrapper>
      <table>
        <thead>
          {round.title === 'TOTAL' ? (
            <tr>
              <th>Rank</th>
              <th>Team Name</th>
              <th>Total FK</th>
              <th>Total Point</th>
            </tr>
          ) : (
            <tr>
              <th>Team Name</th>
              <th>Field Kill</th>
              <th>Rank</th>
              <th>Death from Non-Player</th>
            </tr>
          )}
        </thead>
        <Tbody total={round.title === 'TOTAL'}>
          {data.map((row: (string | number)[], rowIndex: number) => (
            <Tr isCheckmate={handleCheckmate(row)}>
              {row.map((item: string | number, index: number) =>
                round.title === 'TOTAL' ? (
                  <td>{item}</td>
                ) : (
                  <td>
                    <input
                      value={item}
                      placeholder="-"
                      onChange={(e) => handleEdit(e, rowIndex, index)}
                    />
                  </td>
                ),
              )}
            </Tr>
          ))}
        </Tbody>
      </table>
    </Wrapper>
  );
};

export default Table;
