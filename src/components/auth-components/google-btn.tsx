/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../fbCode/fbase";
import { Error } from "../../style/auth-components";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { SocialBtn } from "../../style/social-btn";

const Logo = styled.img`
  height: 25px;
`;

export default function GoogleBtn() {
  const [error, setError] = useState("");
  const navi = useNavigate();

  const onGithubBtn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navi("/");
    } catch (e: any) {
      console.log(e.message);
      if (e instanceof FirebaseError) setError(e.message);
    }
  };
  return (
    <>
      {error !== "" && <Error>{error}</Error>}
      <SocialBtn onClick={onGithubBtn}>
        <Logo src="/google-logo.svg"></Logo>
        Countinue with Google
      </SocialBtn>
    </>
  );
}