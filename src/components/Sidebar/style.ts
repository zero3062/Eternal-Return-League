import styled from "styled-components";

export const Wrapper = styled.div`
    position: fixed;
    height: 100%;
    width: 350px;
    padding: 20px;
    color: white;
    background: rgb(43,45,49);
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
        color: white;
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
`

export const List = styled.li<{active: boolean}>`
    cursor: pointer;
    margin-bottom: 10px;
    padding: 10px;
    border-radius: 5px;

    background: ${(props) => (props.active ? 'rgba(255, 255, 255, 0.1)' : 'transparent')};

    &:last-child {
        margin-bottom: 0;
    }
`