import styled from "styled-components";
import { useNavigate } from "react-router-dom";

export default function HomeUnLogin(props) {
  const nav = useNavigate();

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

  const Sub = styled.div`
    margin-top: 20px;
    font-size: 45px;
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

  return (
    <Wrapper>
      <Title>Vreads</Title>
      <Sub>Watch And Find A Vreads</Sub>
      <AccountBox>
        <Button onClick={() => nav("/login")}>Sign in</Button>
        <Button onClick={() => nav("/createAccount")}>Sign up</Button>
      </AccountBox>
    </Wrapper>
  );
}
