import styled from 'styled-components';

export const Wrapper = styled.div`
  margin-left: 350px;
  position: fixed;
  height: 100%;
  width: 200px;
  padding: 20px;
  color: white;
  background: rgb(47, 49, 52);
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 0;
  font-size: 24px;

  p {
    margin: 0;
  }

  img {
    width: 22px;
    height: 22px;
    filter: invert(100%) sepia(0%) saturate(7487%) hue-rotate(13deg)
      brightness(108%) contrast(104%);
    cursor: pointer;
    padding: 8px;
    border-radius: 5px;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }
  }
`;

export const ListWrapper = styled.ul`
  height: 93%;
  overflow-y: scroll;
  list-style-type: none;
  padding-left: 0;
`;

export const List = styled.li<{ active: boolean }>`
  cursor: pointer;
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  background: ${(props) =>
    props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent'};

  &:last-child {
    margin-bottom: 0;
  }
`;

export const ListHeader = styled.div`
  display: flex;
  align-items: center;
  font-size: 15px;
  justify-content: space-between;

  input {
    background: transparent;
    color: white;
    border: none;
    padding: 16px 0px;
    width: 300px;
    font-size: 15px;
    outline: none;
  }

  img {
    filter: invert(100%) sepia(0%) saturate(7487%) hue-rotate(13deg)
      brightness(108%) contrast(104%);
    width: 20px;
  }
`

export const DeleteImg = styled.img`
  &:hover {
    filter: invert(25%) sepia(87%) saturate(7446%) hue-rotate(356deg)
      brightness(106%) contrast(117%);
  }
`;
