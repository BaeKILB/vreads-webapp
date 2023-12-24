import { Outlet, useNavigate } from "react-router-dom";
import SideNav from "./SideNav";
import styled from "styled-components";
import { OutletWrapper } from "../style/OutletWrapper";
import NavBar from "./NavBar";
import { checkToken } from "./springApi/springAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Wrapper = styled.div`
  display: grid;
  gap: 20px;
  grid-template-columns: 1fr 4fr;
  height: 100%;
  padding: 50px 0px;
  width: 100%;
  max-width: 860px;
`;
export default function RootLayout() {
  const navi = useNavigate();

  const tokenAllowCheck = async () => {
    const result = await checkToken();

    if (result) {
      if (result.state !== "true") {
        alert("로그인 토큰이 만료되었습니다 !");
        localStorage.removeItem("token");
        navi("/welcome");
      }
    }
  };

  // 만약 로그인 되어있는 상태면 토큰 재발급 동작 시키기

  const tk = localStorage.getItem("token");

  if (tk) {
    tokenAllowCheck();
  }

  return (
    <>
      <Wrapper>
        <SideNav />
        <OutletWrapper>
          <NavBar />
          <Outlet />
        </OutletWrapper>
      </Wrapper>
    </>
  );
}
