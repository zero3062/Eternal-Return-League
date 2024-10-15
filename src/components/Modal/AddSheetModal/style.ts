import { styled } from "styled-components";

export const Content = styled.div`
    display: flex;
    flex-direction: column;
    max-width: 400px;
`

export const Header = styled.div`
    font-size: 24px;
    margin-bottom: 10px;
`

export const Input = styled.input`
    width: 100%;
    outline: none;
    padding: 10px 20px;
    border: 1px solid white;
    border-radius: 5px;
    box-sizing: border-box;
    color: white;
    background: transparent;
    margin: 10px 0px;
`

export const CheckboxGroup = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
`

export const Checkbox = styled.div`
    display: flex;
    align-items: center;
    margin-right: 10px;

    &:last-child {
        margin-right: 0;
    }

    input[type="checkbox"] {
        display: none;
    }

    label {
        cursor: pointer;
        padding: 10px;
        position: relative;
        border: 1px solid white;
        border-radius: 5px;
        text-align: center;
    }

    label:hover,  input[type="checkbox"]:checked + label {
        background: white;
        color: rgb(49, 51, 56);
        border: 1px solid rgb(49, 51, 56);
    }
`

export const Button = styled.button`
    cursor: pointer;
    padding: 10px 20px;
    background: rgb(49, 51, 56);
    color: white;
    border: 1px solid white;
    border-radius: 5px;
    margin: 10px 0px;

    &:hover {
        background: white;
        color: rgb(49, 51, 56);
        border: 1px solid rgb(49, 51, 56);
    }
`;