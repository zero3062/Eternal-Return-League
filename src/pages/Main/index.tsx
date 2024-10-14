import React, { useState } from 'react';
import { getRound } from '../../apis/spreadApi';
import { Sidebar, AddSheetModal } from '../../components';
import { Wrapper, Table, Content } from './style';

const Main = () => {
  const [open, setOpen] = useState(false);
  const [round, setRound] = useState<number[][]>([]);

  const handleGetData = async (title: string) => {
    const response: any = await getRound(title);
    setRound(response);
  };

  return (
    <Wrapper>
      <Content>
        <Sidebar handleGetData={handleGetData} setOpen={setOpen} />
        {round.length !== 0 && (
          <Table>
            <table>
              <thead>
                <tr>
                  {Array.from({ length: round[0].length / 2 }).map(
                    (_, index) => (
                      <th key={index} colSpan={2}>
                        Round {index + 1}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {round.map((row: any, rowIndex) => (
                  <tr key={rowIndex}>
                    {row.map((cell: any, colIndex: number) => (
                      <td key={colIndex}>
                        <input readOnly type="text" value={cell || ''} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </Table>
        )}
      </Content>
      <AddSheetModal open={open} setOpen={setOpen} />
    </Wrapper>
  );
};

export default Main;
