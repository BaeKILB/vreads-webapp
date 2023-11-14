/* eslint-disable @typescript-eslint/no-explicit-any */
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const WarpperProfileBox = styled.div`
  margin: 5px;
  padding: 10px;
  /* display: flex;
  justify-content: center;
  align-items: center; */
  text-align: center;
  width: 45%;
  border: 2px solid #fcbb79;
  border-radius: 10px;
  cursor: pointer;
`;
const ProfileImgWrap = styled.label`
  width: 50px;
  margin: auto;
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

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

export default function ProfileBox(props: any) {
  const { mem_idx, mem_nickname, mem_profileImageUrl, mem_bio } =
    props.userInfo;

  const navi = useNavigate();
  return (
    <WarpperProfileBox onClick={() => navi("/profile/" + mem_idx)}>
      <ProfileImgWrap>
        {mem_profileImageUrl ? (
          <ProfileImg src={mem_profileImageUrl} />
        ) : (
          <ProfileImg src="/profile1-svgrepo-com.svg" />
        )}
      </ProfileImgWrap>
      <Username>{mem_nickname ? mem_nickname : "Baker"}</Username>
      <Payload>{mem_bio ? mem_bio : "Hello Bakers"}</Payload>
    </WarpperProfileBox>
  );
}
