import { Outlet } from "react-router-dom";
import Nav from "./Nav";
import styled from "styled-components";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function RootLayout(props: any) {
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
        <Nav />
        <Outlet />
      </Wrapper>
    </>
  );
}
