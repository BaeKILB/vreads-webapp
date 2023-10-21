import { GithubAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../fbCode/fbase";
import { Error } from "../../style/auth-components";
import { useState } from "react";
import { FirebaseError } from "firebase/app";

export default function GithubBtn(props) {
  const [error, setError] = useState("");
  const navi = useNavigate();

  const Button = styled.span`
    margin-top: 50px;
    background-color: white;
    font-weight: 500;
    width: 100%;
    color: black;
    padding: 10px 20px;
    border-radius: 50px;
    border: 0;
    display: flex;
    gap: 5px;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  `;

  const Logo = styled.img`
    height: 25px;
  `;
  const onGithubBtn = async () => {
    try {
      const provider = new GithubAuthProvider();
      await signInWithPopup(auth, provider);
      navi("/");
    } catch (e) {
      console.log(e.message);
      if (e instanceof FirebaseError) setError(e.message);
    }
  };
  return (
    <>
      {error !== "" && <Error>{error}</Error>}
      <Button onClick={onGithubBtn}>
        <Logo src="/github-logo.svg"></Logo>
        Countinue with Github
      </Button>
    </>
  );
}
