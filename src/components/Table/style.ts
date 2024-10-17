import { styled } from 'styled-components';

export const Wrapper = styled.div`
  margin-left: 590px;
  overflow-x: scroll;
  padding: 20px;
  color: white;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 20px;

  th,
  td {
    border-bottom: 1px solid white;
    text-align: center;
    padding: 10px;
  }

  th {
    background: white;
    color: rgb(53,54,59);
  }

  input {
    padding: 10px;
    border: none;
    background: transparent;
    color: white;
    outline: none;
    font-size: 20px;
    text-align: center;
  }

  tr td:first-child input {
    width: 200px;
  }

  tr td:not(:first-child) input {
    width: 100px;
  }
`;

export const Tbody = styled.tbody<{total: boolean}>`
  ${(props) => props.total && `
    tr:nth-child(-n+5) {
      background: rgb(109, 158, 235);
    }

    tr:nth-child(n+5):nth-child(-n+8) {
      background: rgb(224, 102, 102);
    }
  `}
`

export const Tr = styled.tr<{isCheckmate: boolean}>`
  ${(props) => props.isCheckmate && `
    color: rgb(0, 255, 0);
  `}
`