import styled from "styled-components";

export const Form = styled.form`
  margin: 10px 0;
  display: flex;
  flex-direction: column;
  gap: 3px;
  width: 100%;
`;

export const BtnWarp = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  margin-top: 5px;
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
  display: inline-block;
  color: #fcbb79;
  text-align: center;
  border-radius: 10px;
  border: 1px solid #fcbb79;
  font-size: 14px;
  font-weight: 600;
  background-color: white;
  transition: background-color 0.3s, color 0.3s;
  cursor: pointer;
  img {
    width: 40px;
  }
  &:hover {
    background-color: #fcbb79;
    color: black;
  }
`;

export const FileInput = styled.input`
  display: none;
`;
