/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { Button } from "../../style/Button";
import { springSocialLogin } from "../../components/springApi/springAuth";

export default function SocialLogin() {
  const params = new URLSearchParams(location.search);
  const [error, setError] = useState("");

  const onSocialLogin = async () => {
    console.log(params);

    const result = await springSocialLogin(params);

    console.log("result");
    if (!result) {
      setError("소셜 로그인 중 문제가 발생했습니다!");
    }
    if (result.state !== "true") {
      console.log(result.error);
      setError(result.error);
    } else {
      console.log("close window");
      opener.location.href = import.meta.env.VITE_APP_HOSTING_URL;
      window.close();
    }
  };

  const onFail = () => {
    window.close();
  };

  console.log("start");
  onSocialLogin();

  console.log("end");
  return (
    <>
      <h3>{error}</h3>
      <Button onClick={onFail}>Close</Button>
    </>
  );
}
