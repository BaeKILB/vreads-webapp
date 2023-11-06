import styled from "styled-components";

export const SocialBtn = styled.button`
  margin: 5px;
  background-color: white;
  font-weight: 500;
  width: 100%;
  color: black;
  padding: 10px 20px;
  border-radius: 10px;
  display: flex;
  gap: 5px;
  align-items: center;
  justify-content: center;
  border: 2px solid white;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: black;
    color: white;
  }

  &.first {
    margin-top: 30px;
  }
  &.hidden {
    display: none;
  }
`;
