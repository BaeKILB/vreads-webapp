/* eslint-disable @typescript-eslint/no-explicit-any */
import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { auth } from "../../fbCode/fbase";

import { Error, Form, Title, Wrapper } from "../../style/auth-components";
import { Input } from "../../style/Input";
import { Button } from "../../style/Button";
import GithubBtn from "../../components/auth-components/github-btn";
import GoogleBtn from "../../components/auth-components/google-btn";

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    passwd: "",
  });

  const nav = useNavigate();

  const { email, passwd } = formData;

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 유효성 체크
      if (isLoading || email === "" || passwd === "") return;
      // 유저 로그인 동작
      const loginResult = await signInWithEmailAndPassword(auth, email, passwd);
      console.log(loginResult.user);
      nav("/");
    } catch (e: any) {
      setError(e.message);
    } finally {
      setIsLoading(false);
    }
    console.log(formData);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { name, value },
    } = e;
    if (name === "name")
      setFormData((state) => {
        return { ...state, name: value };
      });
    else if (name === "email")
      setFormData((state) => {
        return { ...state, email: value };
      });
    else if (name === "passwd")
      setFormData((state) => {
        return { ...state, passwd: value };
      });
  };

  // const onSocialClick = async (e) => {
  //   const {
  //     target: { name },
  //   } = e;

  // let provider;

  // if (name === "google") {
  //   provider = new firebaseInstance.auth.GoogleAuthProvider();
  // } else if (name === "github") {
  //   provider = new firebaseInstance.auth.GithubAuthProvider();
  // }
  // try {
  //   const data = await authService.signInWithPopup(provider);
  // } catch (e) {
  //   setError(error.message);
  // }
  // };

  return (
    <Wrapper>
      <Title>Sign in</Title>
      <Form action="" onSubmit={onSubmitHandler}>
        <Input
          type="email"
          placeholder="Email"
          name="email"
          required
          value={email}
          onChange={onChangeHandler}
        />
        <Input
          type="password"
          placeholder="Password"
          name="passwd"
          required
          value={passwd}
          onChange={onChangeHandler}
        />
        <Button type="submit">{isLoading ? "Loading..." : "Sign in"}</Button>
      </Form>
      <GithubBtn />
      <GoogleBtn />
      {error !== "" && <Error>{error}</Error>}
    </Wrapper>
  );
};

export default Login;
