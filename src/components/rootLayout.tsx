import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";
import styled from "styled-components";
import { OutletWrapper } from "../style/OutletWrapper";
import NavBar from "./NavBar";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RootLayout() {
  const Wrapper = styled.div`
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr 4fr;
    height: 100%;
    padding: 50px 0px;
    width: 100%;
    max-width: 860px;
  `;

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
