import styled from "styled-components";

export const Button = styled.button`
  border: none;
  border-radius: 10px;
  min-width: 150px;
  font-size: large;
  padding: 10px 0px;
  background-color: #fcbb79;
  color: white;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: white;
    color: black;
  }

  //======className=======

  &.SubmitBtn {
    padding: 10px;
    width: 100%;
    font-size: 16px;
  }
`;
