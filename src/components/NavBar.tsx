import { NavLink } from "react-router-dom";
import styled from "styled-components";

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
  return (
    <NavBox>
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
