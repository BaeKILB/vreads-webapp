/* eslint-disable @typescript-eslint/no-explicit-any */
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useState } from "react";

import { auth } from "../../fbCode/fbase";

import { useNavigate } from "react-router-dom";
import { Button } from "../../style/Button";
import { Input } from "../../style/Input";
import { FirebaseError } from "firebase/app";
import { Error, Form, Title, Wrapper } from "../../style/auth-components";
import GithubBtn from "../../components/auth-components/github-btn";
import GoogleBtn from "../../components/auth-components/google-btn";
import { addUserInfo } from "../../fbCode/fLogin";

const CreateAccount = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passwd: "",
  });

  const nav = useNavigate();

  const { name, email, passwd } = formData;

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 유효성 체크
      if (isLoading || name === "" || email === "" || passwd === "") return;
      // 유저 추가 동작
      const createUserResult = await createUserWithEmailAndPassword(
        auth,
        email,
        passwd
      );
      console.log(createUserResult.user);
      await updateProfile(createUserResult.user, { displayName: name });

      await addUserInfo(createUserResult.user.uid, name, email, 0, null);
      nav("/");
    } catch (e: any) {
      // 에러 형태가 firebase error일 경우
      if (e instanceof FirebaseError) setError(e.message);
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
    console.log(formData);
  };

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) return;

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

  return (
    <Wrapper>
      <Title>Sign up</Title>
      <Form action="" onSubmit={onSubmitHandler}>
        <Input
          type="text"
          placeholder="Name"
          name="name"
          required
          value={name}
          onChange={onChangeHandler}
        />
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
        <Button type="submit">
          {isLoading ? "Loading..." : "Create Account"}
        </Button>
      </Form>

      <GithubBtn />
      <GoogleBtn />
      {error !== "" && <Error>{error}</Error>}
    </Wrapper>
  );
};

export default CreateAccount;
