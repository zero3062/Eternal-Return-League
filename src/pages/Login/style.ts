import { styled } from "styled-components";

export const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    height: 100vh;
    align-items: center;
    justify-content: center;
`

export const Header = styled.div`
    font-size: 30px;
    margin-bottom: 20px;
    color: white;
    font-weight: bold;
`

export const Button = styled.button`
    font-size: 18px;
    padding: 10px 20px;
    border: none;
    border-radius: 5px;
    background: white;
    color: rgb(49,51,56);
    cursor: pointer;
`