/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";

export default function SocialLogin() {
  const params = new URLSearchParams(location.search);
  const onSocialLogin = async () => {
    console.log(params);

    try {
      // 유효성 체크

      // 유저 추가 동작
      const createUserResult = await fetch(
        import.meta.env.VITE_APP_SPRING_API_URL +
          "login/oauth2/code/google?" +
          params,
        {
          credentials: "include",
        }
      );
      const result = await createUserResult.json();
      if (result.state == "false") {
        console.log("error");
      } else {
        console.log("create ok");
      }
      // nav("/");
    } catch (e: any) {
      // 에러 형태가 firebase error일 경우
      console.log(e.message);
    }
  };

  useEffect(() => {
    onSocialLogin();
  }, []);

  return <h3>{params.toString()}</h3>;
}
