import { styled } from 'styled-components';

export const Wrapper = styled.div`
  margin-left: 630px;
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
    background: rgb(28 73 139);
    color: white;
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
