/* eslint-disable @typescript-eslint/no-explicit-any */
// import { useHistory } from "react-router-dom";
// import { authService } from "../fbCode/fbase.js";

import { useEffect, useState } from "react";
import Vread from "../../components/Home/vread";
import { Button } from "../../style/Button";
import { Error } from "../../style/etc_style";
import styled from "styled-components";
import { useNavigate, useParams } from "react-router-dom";
import {
  IUser,
  springProfileUpdate,
  springUserInfo,
} from "../../components/springApi/springUser";
import {
  IVread,
  SET_PAGE_LIST_LIMIT_INIT,
  START_COUNT_INIT,
  getUserVreads,
} from "../../components/springApi/springVreads";

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

const Payload = styled.p`
  margin: 10px 0px;
  padding: 5px;
  font-size: 18px;
  border: 1px solid #fcbb79;
  border-radius: 10px;
`;

export default function Profile() {
  const [user, setUser] = useState({
    uid: "",
    bio: "",
    displayName: "",
    photoURL: "",
  });

  const [profileImg, setProfileImg] = useState(user?.photoURL);
  const [nameInput, setNameInput] = useState(user?.displayName);
  const [bioInput, setBioInput] = useState(user?.displayName);
  const [vreads, setVreads] = useState<IVread[]>([]);
  const [profileError, setProfileError] = useState("");

  const [startCount, setStartCount] = useState(START_COUNT_INIT);
  const [pageListLimit, setPageListLimit] = useState(SET_PAGE_LIST_LIMIT_INIT);

  const [isClickName, setIsClickName] = useState(false);
  const [isClickBio, setIsClickBio] = useState(false);
  const [isProLoading, setIsProLoading] = useState(false);

  const navi = useNavigate();
  // 다른 유저 페이지로 접근시
  const { anotherUserUid } = useParams();

  const getAnotherUserInfo = async () => {
    if (!anotherUserUid || anotherUserUid === "") {
      const result = await springUserInfo("");
      const userTemp: IUser = result.data;

      if (userTemp) {
        setUser({
          uid: userTemp.mem_idx.toString(),
          displayName: userTemp.mem_nickname || "",
          bio: userTemp.mem_bio || "",
          photoURL: userTemp.mem_profileImageUrl || "",
        });
        setNameInput(userTemp.mem_nickname);
        setBioInput(userTemp.mem_bio);
        setProfileImg(userTemp.mem_profileImageUrl || "");
      } else {
        setProfileError(result.error);
      }
    } else {
      const resultInfo = await springUserInfo(anotherUserUid);
      const userTemp: IUser = resultInfo.data;

      if (!userTemp || resultInfo.state !== "true") {
        alert(resultInfo.error);
        navi("/");
      } else {
        setUser({
          uid: userTemp.mem_idx.toString(),
          displayName: userTemp.mem_nickname || "",
          bio: userTemp.mem_bio || "",
          photoURL: userTemp.mem_profileImageUrl || "",
        });
        setNameInput(userTemp.mem_nickname);
        setBioInput(userTemp.mem_bio);
        setProfileImg(userTemp.mem_profileImageUrl || "");
      }
    }
  };

  const getVreadList = async (isSearchMore: boolean) => {
    if (isProLoading) return;

    let uid = localStorage.getItem("uid");

    if (anotherUserUid) uid = anotherUserUid;

    if (!uid) {
      setProfileError("유저 번호를 받을수 없습니다 !");
      return;
    }

    // 만약 load more 을 눌렀을때 카운트 셋팅 하기
    // 주의! 수정 해준뒤 변수에 따로 담아 똑같은 값으로 추가 해 준 뒤 사용
    // useState 는 변경 직후가 아닌 스냅샷 값을 이용하기 때문

    let startLimit = startCount;
    let pageLimit = pageListLimit;

    if (!isSearchMore) {
      setStartCount(START_COUNT_INIT);
      startLimit = START_COUNT_INIT;
    } else {
      setStartCount((state) => state + SET_PAGE_LIST_LIMIT_INIT);
      startLimit += SET_PAGE_LIST_LIMIT_INIT;
    }

    if (!isSearchMore) {
      setPageListLimit(SET_PAGE_LIST_LIMIT_INIT);
      pageLimit = SET_PAGE_LIST_LIMIT_INIT;
    } else {
      setPageListLimit((state) => state + SET_PAGE_LIST_LIMIT_INIT);
      pageLimit += SET_PAGE_LIST_LIMIT_INIT;
    }

    if (!isSearchMore) setStartCount(START_COUNT_INIT);
    else setStartCount((state) => state + SET_PAGE_LIST_LIMIT_INIT);

    if (!isSearchMore) setPageListLimit(SET_PAGE_LIST_LIMIT_INIT);
    else setPageListLimit((state) => state + SET_PAGE_LIST_LIMIT_INIT);

    // uid로 검색은 0 .. 그리고
    const vreadsResult = await getUserVreads(
      uid,
      "0",
      "",
      0,
      startLimit,
      pageLimit
    );

    if (vreadsResult.state !== "true") {
      setProfileError(vreadsResult.error);
      return;
    }
    if (vreadsResult.data) {
      // 만약 LoadMore 을 클릭했다면 ...
      if (isSearchMore === true)
        setVreads((state) => [...state, ...vreadsResult.data]);
      else setVreads(vreadsResult.data);
    }
  };

  // 더보기 구현
  const onLoadMore = () => {
    getVreadList(true);
  };

  // Vread list 받기
  useEffect(() => {
    getAnotherUserInfo();
    getVreadList(false);
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

      const updateResult = await springProfileUpdate("", "", file);

      if (updateResult.state !== "true") {
        setProfileError(updateResult.error);
      }
      const resultData = updateResult.data;

      if (
        resultData.mem_profileImageUrl &&
        resultData.mem_profileImageUrl !== ""
      )
        setProfileImg(resultData.mem_profileImageUrl);
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
      const updateResult = await springProfileUpdate(nameInput, "", null);
      if (updateResult.state == false) {
        if (updateResult.error !== "") setProfileError(updateResult.error);
      }
    }
    onClickNameHandler();
    setNameInput("");
    setIsProLoading(false);
  };

  // 소개(bio) 눌렀을때 수정칸 띄우기
  const onClickBioHandler = () => {
    // 만약 다른 userUid로 들어온 페이지면 ...
    if (anotherUserUid) return;
    setIsClickBio((state) => !state);
  };

  //소개(bio) 입력 동작
  const onBioChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { value },
    } = e;
    setBioInput(value);
  };

  const onBioUpdateHandler = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 만약 다른 userUid로 들어온 페이지면 ...
    if (anotherUserUid) return;

    if (isProLoading) return;

    setIsProLoading(true);
    setProfileError("");

    if (bioInput !== "") {
      const updateResult = await springProfileUpdate("", bioInput, null);
      if (updateResult.state == false) {
        if (updateResult.error !== "") setProfileError(updateResult.error);
      }
    }
    onClickBioHandler();
    setBioInput("");
    setIsProLoading(false);
  };

  return (
    <Wrapper>
      <AvatarUpload htmlFor="profileImg">
        {profileImg !== "" ? (
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
          <Button onClick={onClickNameHandler}>Cancel</Button>
        </>
      ) : (
        <Name onClick={onClickNameHandler}>{user?.displayName}</Name>
      )}
      {isClickBio ? (
        <>
          <NameInput
            key="pro_bioin"
            name="bio"
            value={bioInput}
            onChange={onBioChangeHandler}
            required
          />
          <Button onClick={onBioUpdateHandler}>Update</Button>
          <Button onClick={onClickBioHandler}>Cancel</Button>
        </>
      ) : (
        <Payload onClick={onClickBioHandler}>
          {bioInput !== "" ? bioInput : "Hello Bakers"}
        </Payload>
      )}
      {profileError !== "" && <Error key="pro_err">{profileError}</Error>}
      <VreadsTitle>{user?.displayName} 's Vread list</VreadsTitle>
      <TimelineWrapper>
        {vreads && vreads.length > 0
          ? vreads.map((vt) => (
              <Vread
                key={vt.vreads_idx + "_pro"}
                onReload={getVreadList}
                vread={vt}
              />
            ))
          : "There are currently no posted Vread."}

        {vreads && vreads.length > 0 ? (
          <Button onClick={onLoadMore}>Load more</Button>
        ) : (
          ""
        )}
      </TimelineWrapper>
    </Wrapper>
  );
}
