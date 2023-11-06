import * as React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  // 파라미터로 props 의 children 만 받고 객체 안의 타입을 알려주는 형태의 파라미터
  // 객체(오브젝트) 안의 파라미터는 대괄호 써야함
  children,
}: {
  children: React.ReactNode;
}) {
  // 로그인 되어있는지 확인하기
  // const user = auth.currentUser;
  const user = localStorage.getItem("token");

  if (!user) {
    return <Navigate to="/welcome" />;
  } else {
    return children;
  }
}
