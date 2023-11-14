import { Outlet } from "react-router-dom";
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
  checkToken();

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
