import styled from 'styled-components';

export const Wrapper = styled.div`
    position: relative;
    height: 100vh;
    width: 100%;
    background: rgb(49,51,56);
`;

export const Content = styled.div`
    display: flex;
    height: 100%;
`
    
export const Table  = styled.div`
    margin-left: 630px;
    overflow-x: scroll;

    th, tr, td, input {
        background: transparent;
        color: white;
    }

    th, input {
        border: 1px solid white;
        padding:5px;
        outline: none;
    }
`;