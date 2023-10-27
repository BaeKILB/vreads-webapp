/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useHistory } from "react-router-dom";
// import { authService } from "../fbCode/fbase.js";

import { useEffect, useState } from "react";
import { auth } from "../../fbCode/fbase";

import { IVread, getVreads, updateUser } from "../../fbCode/fdb";
import Vread from "../../components/Home/vread";
import { Button } from "../../style/Button";
import { Error } from "../../style/etc_style";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import { getUserInfo } from "../../fbCode/fLogin";

const TimelineWrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
`;

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-top: 5px;
  width: 100%;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
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

const AvatarImg = styled.img`
  width: 90%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
  cursor: pointer;
`;

const VreadsTitle = styled.p`
  font-size: 22px;
  color: #fcbb79;
  font-weight: bold;
  margin: 5px 0;
`;

const NameInput = styled.input`
  padding: 10px;
  border-radius: 10px;
  border: none;
  min-width: 80px;
  width: 50%;
  max-width: 200px;
  font-size: 16px;
`;

export default function Profile() {
  const [user, setUser] = useState({ uid: "", displayName: "", photoURL: "" });
  const navi = useNavigate();
  // 다른 유저 페이지로 접근시
  const { anotherUserUid } = useParams();
  console.log(anotherUserUid);
  const limitCount = 30;

  const getAnotherUserInfo = async () => {
    if (!anotherUserUid || anotherUserUid === "") {
      const userTemp = auth.currentUser;

      if (userTemp?.uid || userTemp?.displayName || userTemp?.photoURL) {
        setUser({
          uid: userTemp.uid,
          displayName: userTemp.displayName || "",
          photoURL: userTemp.photoURL || "",
        });
        setProfileImg(userTemp.photoURL || "");
      }
      return;
    }

    const resultInfo = await getUserInfo(anotherUserUid);
    if (!resultInfo.user || resultInfo.state === false) {
      navi("/");
    } else {
      const userInfo = resultInfo.user;
      setUser({
        uid: userInfo.uid,
        displayName: userInfo.name,
        photoURL: userInfo.photoURL,
      });
      setProfileImg(userInfo.photoURL);
    }
  };

  const [profileImg, setProfileImg] = useState(user?.photoURL);
  const [nameInput, setNameInput] = useState(user?.displayName);
  const [vreads, setVreads] = useState<IVread[]>([]);
  const [profileError, setProfileError] = useState("");

  const [isClickName, setIsClickName] = useState(false);
  const [isProLoading, setIsProLoading] = useState(false);

  const getVreadList = async (limitStart: string | null) => {
    if (isProLoading) return;
    let uid = user?.uid;
    if (anotherUserUid) uid = anotherUserUid;
    console.log(uid);
    const vreadsResult = await getVreads(1, uid, limitCount, limitStart, null);

    if (vreadsResult.state == false) {
      return;
    }
    if (vreadsResult.vreads) {
      setVreads(vreadsResult.vreads);

      console.log(vreadsResult.vreads);
    }
  };

  // Vread list 받기
  useEffect(() => {
    getAnotherUserInfo();
    getVreadList(null);
  }, []);

  //프로필 이미지 수정

  // 주의!!! 해당 파일 선택창 동작은 onClick 이 아닌 onChange 로 해야함
  //  파일을 선택하면 input 안에 경로를 넣는 형식이라 onChange로 해야 됨
  const onProfileImgChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // 만약 다른 userUid로 들어온 페이지면 ...
    if (anotherUserUid) return;
    // setIsProLoading(true);
    setProfileError("");
    const { files } = e.target;
    if (!user) return;
    if (files && files.length === 1) {
      const file = files[0];

      const updateResult = await updateUser({ profileImg: file });

      if (updateResult.state == false) {
        setProfileError(updateResult.error);
      }

      // // 사진 넣기위한 경로지정
      // const photoref = ref(storage, "profiles/photo/" + user?.uid);

      // // 사진 업로드 및 파일 url 받기
      // const result = await uploadBytes(photoref, file);
      // const photoURL = await getDownloadURL(result.ref);
      // await updateProfile(user, { photoURL: photoURL });
      if (updateResult.photoURL && updateResult.photoURL !== "")
        setProfileImg(updateResult.photoURL);
    }
    // setIsProLoading(false);
  };

  // 닉네임 눌렀을때 수정칸 띄우기
  const onClickNameHandler = () => {
    // 만약 다른 userUid로 들어온 페이지면 ...
    if (anotherUserUid) return;
    setIsClickName((state) => !state);
  };

  //닉네임 입력 동작
  const onNameChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setNameInput(value);
  };

  const onNameUpdateHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 만약 다른 userUid로 들어온 페이지면 ...
    if (anotherUserUid) return;

    if (isProLoading) return;

    setIsProLoading(true);
    setProfileError("");

    if (nameInput !== "") {
      const updateResult = await updateUser({ displayName: nameInput });
      if (updateResult.state == false) {
        if (updateResult.error !== "") setProfileError(updateResult.error);
      }
    }
    onClickNameHandler();
    setNameInput("");
    setIsProLoading(false);
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="profileImg">
        {profileImg ? (
          <AvatarImg src={profileImg} />
        ) : (
          <AvatarImg src="/profile1-svgrepo-com.svg" />
        )}
      </AvatarUpload>
      <AvatarInput
        key="pro_imgIn"
        type="file"
        name="profileImg"
        id="profileImg"
        accept="image/*"
        onChange={onProfileImgChange}
      />
      {isClickName ? (
        <>
          <NameInput
            key="pro_namein"
            name="nickName"
            value={nameInput}
            onChange={onNameChangeHandler}
            required
          />
          <Button onClick={onNameUpdateHandler}>Update</Button>
        </>
      ) : (
        <Name onClick={onClickNameHandler}>{user?.displayName}</Name>
      )}
      {profileError !== "" && <Error key="pro_err">{profileError}</Error>}
      <VreadsTitle>{user?.displayName} 's Vread list</VreadsTitle>
      <TimelineWrapper>
        {vreads &&
          vreads.length &&
          vreads.map((vt) => (
            <Vread
              key={vt.id + "_pro"}
              onUpdateReload={() => {
                getVreadList(vt.createDate.toString());
              }}
              onReload={getVreadList}
              vread={vt}
            />
          ))}
      </TimelineWrapper>
    </Wrapper>
  );
}
