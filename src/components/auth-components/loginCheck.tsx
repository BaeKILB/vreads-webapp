import * as React from "react";
import { auth } from "../../fbCode/fbase";
import { useNavigate } from "react-router-dom";
import { Button } from "../../style/button";
import styled from "styled-components";

export default function LoginCheckRoute({
  // 파라미터로 props 의 children 만 받고 객체 안의 타입을 알려주는 형태의 파라미터
  // 객체(오브젝트) 안의 파라미터는 대괄호 써야함
  children,
}: {
  children: React.ReactNode;
}) {
  const navi = useNavigate();
  // 로그인 되어있는지 확인하기
  const user = auth.currentUser;
  const backPageHandler = () => navi(-1);

  const Wrapper = styled.div`
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 420px;
    padding: 50px 0px;
  `;

  // 반대로 로그인 안되어있다면 뒤로가기
  if (user) {
    return (
      <Wrapper>
        <div>이미 로그인 되어있습니다</div>
        <Button onClick={backPageHandler}>뒤로가기</Button>
      </Wrapper>
    );
  } else {
    return children;
  }
}
