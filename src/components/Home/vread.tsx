/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import { deleteVread } from "../../fbCode/fdb";
import { useState } from "react";
import { Error } from "../../style/auth-components";
import { auth } from "../../fbCode/fbase";
import PostVreadForm from "./post-vread-from";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 4fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const PlofileWrap = styled.article`
  display: flex;
  justify-content: left;
  align-items: center;
  height: 55px;
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

const ProfileImg = styled.img`
  width: 100%;
`;

const Column = styled.div`
  &:last-child {
    place-self: end;
  }
`;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  display: inline-block;
  padding: 5px 3px;
  font-weight: 600;
  font-size: 15px;
  margin-left: 5px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  &.vt_title {
    font-size: 20px;
    font-weight: bold;
    color: #fcbb79;
  }
`;

const DatePayload = styled.p`
  margin: 10px 0px;
  font-size: 12px;
  font-style: italic;
`;
const SubTagPayload = styled.p`
  margin: 10px 0px;
  font-size: 15px;
  font-style: italic;
  font-weight: bold;
  color: #fcbb79;
  display: inline-block;
  padding: 5px;

  border: 2px solid #fffbf81d;
  border-radius: 10px;
  &:hover {
    cursor: pointer;
    border: 2px solid #fcbb79;
  }
`;

const ReadMoreP = styled.div`
  color: #fcbb79;
  font-style: italic;
  cursor: pointer;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid tomato;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: black;
    color: tomato;
  }
`;

const UpdateButton = styled.button`
  background-color: #47e6ff;
  color: black;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  margin: 0 3px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
  border: 2px solid #47e6ff;
  transition: background-color 0.3s, color 0.3s;
  &:hover {
    background-color: black;
    color: #47e6ff;
  }
`;

const ModifySpan = styled.span`
  font-size: 14px;
  font-style: italic;
  color: white;
`;

export default function Vread(props: any) {
  const [error, setError] = useState("");
  const [clickUpdateBtn, setClickUpdateBtn] = useState(false);
  const [isDetailReadMore, setIsDetailReadMore] = useState(false);
  const {
    vtTitle,
    vtDetail,
    vtSubtag,
    userId,
    username,
    photo,
    userPhoto,
    createDate,
    modifyDate,
    id,
  } = props.vread;

  // 핸들러

  const user = auth.currentUser;

  const onClickUpdateForm = () => setClickUpdateBtn((state) => !state);

  const onDeleteHandler = async () => {
    setError("");
    const isComfirm = confirm("Are you sure you want to delete this Vread?");
    if (!isComfirm || user?.uid !== userId) {
      return;
    }

    const result = await deleteVread(id, user?.uid, photo);
    if (!result.state) {
      setError(result.error);
    }

    if (props.onReload) props.onReload();
  };

  // 더보기 버튼
  const onClickReadMoreHandler = () => {
    setIsDetailReadMore((state) => !state);
  };

  // 날짜 관련

  let vreadDate: number = 0;
  if (createDate) {
    vreadDate = createDate;
  }

  // 만약 변경된 날짜가 있으면 변경됨 띄우기위한 코드
  let modifyDateCheck: boolean = false;
  if (modifyDate && modifyDate !== 0) {
    modifyDateCheck = true;
  }

  // 날짜 셋팅
  const vd = new Date(vreadDate);
  const vdString =
    vd.getFullYear() + " / " + (vd.getMonth() + 1) + " / " + vd.getDate();

  // 더보기 버튼 띄우기 셋팅
  let detailReadMore = false;
  if (vtDetail && vtDetail !== "" && vtDetail.length > 150) {
    // 150 자 이상일때 텍스트 뒤 내용을 ... 처리

    //버튼 띄우기
    detailReadMore = true;
  }
  return (
    <Wrapper>
      {error !== "" && <Error>{error}</Error>}
      <Column>
        <PlofileWrap>
          <ProfileImgWrap>
            {userPhoto ? (
              <ProfileImg src={userPhoto} />
            ) : (
              <ProfileImg src="/profile1-svgrepo-com.svg" />
            )}
          </ProfileImgWrap>
          <Username>{username}</Username>
        </PlofileWrap>
        <Payload className="vt_title">
          {vtTitle}{" "}
          {modifyDateCheck == true && <ModifySpan>(Edited)</ModifySpan>}
        </Payload>
        {vtDetail !== "" && (
          <>
            <Payload>
              {detailReadMore
                ? isDetailReadMore
                  ? vtDetail
                  : vtDetail.slice(0, 150) + "..."
                : vtDetail}
            </Payload>
            {detailReadMore && (
              <ReadMoreP onClick={onClickReadMoreHandler}>
                {isDetailReadMore ? "Show Less" : "Read More"}
              </ReadMoreP>
            )}
          </>
        )}
        {vtSubtag && <SubTagPayload>SubTag : {vtSubtag}</SubTagPayload>}
        <DatePayload>{vdString}</DatePayload>
        {user?.uid === userId && (
          <>
            <DeleteButton onClick={onDeleteHandler}>delete</DeleteButton>
            <UpdateButton onClick={onClickUpdateForm}>Update</UpdateButton>
          </>
        )}

        {clickUpdateBtn && (
          <PostVreadForm
            vread={props.vread}
            isModify={true}
            closeForm={onClickUpdateForm}
            onUpdateReload={props.onUpdateReload}
          />
        )}
      </Column>

      <Column>{photo ? <Photo src={photo} /> : null}</Column>
    </Wrapper>
  );
}
