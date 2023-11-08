/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { Button } from "../../style/Button";
import { Input } from "../../style/Input";
import { Error, Form, Title, Wrapper } from "../../style/auth-components";
import GithubBtn from "../../components/auth-components/github-btn";
import GoogleBtn from "../../components/auth-components/google-btn";
import {
  MEM_MAX_EMAIL_LENGTH,
  MEM_MAX_NICKNAME_LENGTH,
  MEM_MAX_PASSWD_LENGTH,
  MEM_MIN_EMAIL_LENGTH,
  MEM_MIN_NICKNAME_LENGTH,
  MEM_MIN_PASSWD_LENGTH,
  signupSpring,
} from "../../components/springApi/springAuth";

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

  const onSubmitSpring = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    try {
      const result = await signupSpring(name, email, passwd);

      if (!result) {
        setError("회원가입 중 문제가 발생했습니다!");
      } else {
        if (result.state != "true") {
          setError(result.error);
        } else {
          console.log("create ok");
          nav("/");
        }
      }
    } catch (e: any) {
      // 에러 형태가 firebase error일 경우
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
      <Form action="" onSubmit={onSubmitSpring}>
        <Input
          type="text"
          placeholder="Name"
          name="name"
          minLength={MEM_MIN_NICKNAME_LENGTH}
          maxLength={MEM_MAX_NICKNAME_LENGTH}
          required
          value={name}
          onChange={onChangeHandler}
        />
        <Input
          type="email"
          placeholder="Email"
          name="email"
          minLength={MEM_MIN_EMAIL_LENGTH}
          maxLength={MEM_MAX_EMAIL_LENGTH}
          required
          value={email}
          onChange={onChangeHandler}
        />
        <Input
          type="password"
          placeholder="Password"
          name="passwd"
          minLength={MEM_MIN_PASSWD_LENGTH}
          maxLength={MEM_MAX_PASSWD_LENGTH}
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
