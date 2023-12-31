/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import { logoutSpring } from "../../components/springApi/springAuth";

const Wrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 420px;
  padding: 50px 0px;
`;

const Title = styled.h1`
  color: #fcbb79;
  font-weight: bold;
  font-size: 65px;
`;

const LogoImage = styled.img`
  margin: 20px;
  min-width: 300px;
  width: 50%;
  max-width: 800px;
  background-color: white;
  border-radius: 10px;
  transition: background-color 0.3s;
  cursor: pointer;
  &:hover {
    background-color: #fcbb79;
  }
`;
const Sub = styled.div`
  margin-top: 20px;
  font-size: 45px;
  text-align: center;
  cursor: pointer;
`;

const Button = styled.button`
  margin: 5px;
  border: none;
  border-radius: 10px;
  min-width: 150px;
  font-size: large;
  padding: 5px;
  background-color: #fcbb79;
  color: white;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: white;
    color: black;
  }
`;

const AccountBox = styled.div`
  margin: 20px;
`;

export default function HomeUnLogin() {
  const nav = useNavigate();

  try {
    logoutSpring();
  } catch (e: any) {
    console.log("error");
    console.log(e.message);
  }

  return (
    <Wrapper>
      <Title>Vreads</Title>
      <LogoImage onClick={() => nav("/")} src="/bread-svgrepo-com.svg" />
      <Sub onClick={() => nav("/")}>Watch And Find A Vreads</Sub>
      <AccountBox>
        <Button onClick={() => nav("/login")}>Sign in</Button>
        <Button onClick={() => nav("/createAccount")}>Sign up</Button>
      </AccountBox>
    </Wrapper>
  );
}
