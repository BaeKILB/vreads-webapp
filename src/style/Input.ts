import styled from "styled-components";

export const Input = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: none;
  width: 100%;
  font-size: 16px;

  //=====type=====
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }

  //=====class=====

  &.title {
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
    min-height: 70px;
  }
  &.detail {
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    min-height: 100px;
  }
`;
