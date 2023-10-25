import { Link, useNavigate } from "react-router-dom";
import { auth } from "../fbCode/fbase";
import { FirebaseError } from "firebase/app";
import styled from "styled-components";

export default function SideNav(props) {
  const navi = useNavigate();
  const onLogoutHandler = async () => {
    const answer = confirm("정말 로그아웃 하시겠습니까?");

    if (answer) {
      try {
        await auth.signOut();
        navi("/welcome");
      } catch (e) {
        if (e instanceof FirebaseError) {
          alert("로그아웃중 문제가 발생했습니다! : " + e.message);
        } else {
          alert("로그아웃중 문제가 발생했습니다!");
        }
        console.log(e.message);
      }
    }
  };

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
    border: 2px solid white;
    height: 50px;
    width: 50px;
    border-radius: 20%;
    background-color: white;
    img {
      width: 30px;
      fill: white;
    }
    &.log-out {
      border-color: tomato;
      svg {
        fill: tomato;
      }
    }
  `;

  return (
    <Menu>
      <Link to="/">
        <MenuItem>
          <img src="/bread-svgrepo-com.svg" alt="Vreads" />
        </MenuItem>
      </Link>

      <Link to="/profile">
        <MenuItem>
          <img src="/profile1-svgrepo-com.svg" alt="Vreads" />
        </MenuItem>
      </Link>

      <Link to="">
        <MenuItem onClick={onLogoutHandler}>
          <img src="/logout-svgrepo-com.svg" alt="logout" />
        </MenuItem>
      </Link>
    </Menu>
  );
}
