/* eslint-disable @typescript-eslint/no-explicit-any */
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { auth } from "../../fbCode/fbase";
import { Error } from "../../style/auth-components";
import { useState } from "react";
import { FirebaseError } from "firebase/app";
import { SocialBtn } from "../../style/social-btn";
import { addUserInfo } from "../../fbCode/fLogin";

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
      //db에 회원 넣기
      const user = auth.currentUser;
      const resultInfo = await addUserInfo(
        user?.uid,
        user?.displayName,
        user?.email,
        1,
        user?.photoURL
      );

      if (!resultInfo || resultInfo.state === false) {
        if (resultInfo.error) {
          setError(resultInfo.error);
        } else {
          setError("Something wrong");
        }
        console.log(resultInfo.error);
        return;
      } else {
        navi("/");
      }
    } catch (e: any) {
      console.log(e.message);
      if (e instanceof FirebaseError) setError(e.message);
    }
  };

  const springOauth2Google = () => {
    window.open(
      "https://accounts.google.com/o/oauth2/auth?client_id=877951810439-pgeplp24bg2t9eej5ffdc7qlde2hjjnc.apps.googleusercontent.com&redirect_uri=" +
        import.meta.env.VITE_APP_HOSTING_URL +
        "login/google&response_type=code&scope=https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile",
      "googleLogin",
      "width=600, height=700"
    );
  };

  return (
    <>
      {error !== "" && <Error>{error}</Error>}
      <SocialBtn className="hidden" onClick={onGithubBtn}>
        <Logo src="/google-logo.svg"></Logo>
        Countinue with Google
      </SocialBtn>
      <SocialBtn onClick={springOauth2Google}>
        <Logo src="/google-logo.svg"></Logo>
        Countinue with Google
      </SocialBtn>
    </>
  );
}
