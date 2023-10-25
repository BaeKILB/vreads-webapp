import styled from "styled-components";

export const Form = styled.form`
  margin-top: 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
`;

export const Textarea = styled.textarea`
  padding: 10px;
  border-radius: 10px;
  border: none;
  width: 100%;
  font-size: 16px;
  height: auto;
  resize: none;
  //=====type=====
  &[type="submit"] {
    cursor: pointer;
    &:hover {
      opacity: 0.8;
    }
  }
`;

export const FileButton = styled.label`
  padding: 10px 0px;
  color: #fcbb79;
  text-align: center;
  border-radius: 10px;
  border: 1px solid #fcbb79;
  font-size: 14px;
  font-weight: 600;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: white;
    color: black;
  }
`;

export const FileInput = styled.input`
  display: none;
`;
