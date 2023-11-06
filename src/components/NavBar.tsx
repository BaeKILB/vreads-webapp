import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { checkToken } from "./springApi/springAuth";

const NavBox = styled.nav`
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  width: 100%;
  max-width: 700px;
  height: 65px;
  border-bottom: 2px solid #ffce9cc1;
  /* border-radius: 10px; */
  background-color: black;
`;

const NavItem = styled.img`
  width: 50px;
  height: 50px;
  padding: 5px;
  background-color: black;
  border-radius: 10px;
  transition: background-color 0.2s, padding 0.1s;
  &:hover {
    background-color: #fcbb79;
  }
  &:active {
    // 클릭시 효과
    background-color: #fcd3aaf4;
    padding: 3px;
  }
`;

export default function NavBar() {
  const onTest = async () => {
    const result = await checkToken();
    console.log(result);
  };

  const onTest2 = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      return {
        state: "emptyToken",
        error: "토큰이 존재하지 않습니다!",
        token: "",
      };
    }
    const result = await fetch(
      "http://localhost:8080/backend/api/auth/testToken",
      {
        method: "GET",
        headers: {
          Authorization: "Bearer " + token,
        },
      }
    );
    console.log(result);
    if (result.status != 200) {
      return {
        state: "fetchError",
        error: "결과를 받아오지 못했습니다!",
        token: "",
      };
    }
    const resultData = await result.json();
    console.log(resultData);
    if (resultData.newToken) {
      localStorage.setItem("token", resultData.newToken);
    }
  };

  return (
    <NavBox>
      <button onClick={onTest}>test</button>
      <button onClick={onTest2}>test2</button>
      <NavLink to={"/search"}>
        <NavItem src="/bread-search.svg" />
      </NavLink>
      <NavLink to={"/subtag"}>
        <NavItem src="/bread-hash.svg" />
      </NavLink>
      <NavLink to={"/"}>
        <NavItem src="/bread-home.svg" />
      </NavLink>
      <NavLink to={"/bakers"}>
        <NavItem src="/bread-bakers.svg" />
      </NavLink>
      <NavLink to={"/profile"}>
        <NavItem src="/profile1-white-com.svg" />
      </NavLink>
    </NavBox>
  );
}
