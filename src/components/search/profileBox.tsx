/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const WarpperProfileBox = styled.div`
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 45%;
  border: 2px solid #fcbb79;
  border-radius: 10px;
`;
const ProfileImgWrap = styled.label`
  width: 50px;
  overflow: hidden;
  height: 50px;
  border-radius: 50%;
  background-color: #fcbb79;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const Username = styled.span`
  display: inline-block;
  padding: 5px 3px;
  font-weight: 600;
  font-size: 15px;
  margin-left: 5px;
`;

const ProfileImg = styled.img`
  width: 100%;
`;
export default function ProfileBox(props: any) {
  const { uid, name, photoURL } = props.userInfo;

  const navi = useNavigate();
  return (
    <WarpperProfileBox onClick={() => navi("/profile/" + uid)}>
      <ProfileImgWrap>
        {photoURL ? (
          <ProfileImg src={photoURL} />
        ) : (
          <ProfileImg src="/profile1-svgrepo-com.svg" />
        )}
      </ProfileImgWrap>
      <Username>{name ? name : "Baker"}</Username>
    </WarpperProfileBox>
  );
}
