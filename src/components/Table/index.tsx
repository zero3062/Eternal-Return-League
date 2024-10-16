import React, { useEffect, useState } from 'react';
import { getRoundData, getTeamData, getTotalData } from '../../apis/spreadApi';
import useRange from '../../hooks/useRange';
import { RoundINF, SheetNmINF } from '../../types/types';
import { Wrapper } from './style';

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
        <tbody>
          {data.map((row: (string | number)[]) => (
            <tr>
              {row.map((item: string | number) => (
                <td>{item}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </Wrapper>
  );
};

export default Table;
