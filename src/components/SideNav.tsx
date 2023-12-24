/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { logoutSpring } from "./springApi/springAuth";

const Menu = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`;

const MenuItem = styled.div`
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50px;
  width: 50px;
  border-radius: 20%;
  background-color: white;
  transition: background-color 0.2s, border-color 0.2s;
  img {
    width: 30px;
    fill: white;
  }

  &:hover {
    background-color: #fcbb79;
  }

  &.nav-logout {
    &:hover {
      background-color: tomato;
      svg {
        fill: tomato;
      }
    }
  }
`;

const AvatarImg = styled.img`
  width: 100%;
  border-radius: 10px;
`;

export default function SideNav() {
  const navi = useNavigate();
  // 로그인 확인용 uid
  const uid = localStorage.getItem("uid");

  const userPhoto = localStorage.getItem("userPhoto");
  const profileImg = userPhoto && userPhoto !== "undefined" ? userPhoto : "";

  const onLogoutHandler = async () => {
    if (!uid) {
      alert("먼저 로그인 해주세요!");
      navi("/welcome");
      return;
    }
    const answer = confirm("정말 로그아웃 하시겠습니까?");

    if (answer) {
      try {
        // 유저 로그아웃 동작
        await logoutSpring();
        navi("/welcome");
      } catch (e: any) {
        alert("로그아웃중 문제가 발생했습니다! : " + e.message);
        console.log(e.message);
      }
    }
  };
  return (
    <Menu>
      <Link to="/">
        <MenuItem>
          <img src="/bread-svgrepo-com.svg" alt="Vreads" />
        </MenuItem>
      </Link>

      <Link to="/profile">
        <MenuItem>
          {profileImg !== "" ? (
            <AvatarImg src={profileImg} />
          ) : (
            <AvatarImg src="/profile1-svgrepo-com.svg" />
          )}
        </MenuItem>
      </Link>

      <Link to="">
        <MenuItem className="nav-logout" onClick={onLogoutHandler}>
          <img src="/logout-svgrepo-com.svg" alt="logout" />
        </MenuItem>
      </Link>
    </Menu>
  );
}
