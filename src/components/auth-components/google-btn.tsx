/* eslint-disable @typescript-eslint/no-explicit-any */

import styled from "styled-components";
import { SocialBtn } from "../../style/social-btn";
const Logo = styled.img`
  height: 25px;
`;

export default function GoogleBtn() {
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
      <SocialBtn onClick={springOauth2Google}>
        <Logo src="/google-logo.svg"></Logo>
        Countinue with Google
      </SocialBtn>
    </>
  );
}
