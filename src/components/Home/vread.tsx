/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import { useState } from "react";
import { Error } from "../../style/auth-components";
import PostVreadForm from "./post-vread-from";
import { useNavigate } from "react-router-dom";
import { IVread, deleteVread } from "../springApi/springVreads";
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
  line-height: 1.5rem;
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
  transition: border 0.2s;
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
  const { isDetail } = props;

  const [error, setError] = useState("");
  const [clickUpdateBtn, setClickUpdateBtn] = useState(false);
  const [isDetailReadMore, setIsDetailReadMore] = useState(false);
  const vreadData: IVread = props.vread;

  // vread 값 적용
  const {
    vd_vtTitle,
    vd_vtDetail,
    vd_subtag,
    mem_idx,
    mem_nickname,
    vd_media_1,
    mem_profileImageUrl,
    vd_createDate,
    vd_modifyDate,
    vreads_idx,
  } = vreadData;

  const navi = useNavigate();

  //uid
  // 만약 로그인 하지 않았을시에 조건도 추가
  const uid = localStorage.getItem("uid");

  // detail 페이지 일때 업데이트, 삭제 버튼 만들기
  let isOnModifyBtn = false;

  if (uid && uid == mem_idx && isDetail) {
    isOnModifyBtn = true;
  }

  // 핸들러

  const onClickUpdateForm = () => setClickUpdateBtn((state) => !state);

  const onDeleteHandler = async () => {
    setError("");
    const isComfirm = confirm("Are you sure you want to delete this Vread?");
    if (!uid || !isComfirm || uid != mem_idx) {
      return;
    }

    const result = await deleteVread(vreads_idx);
    if (!result.state) {
      setError(result.error);
    } else {
      navi(-1);
    }
  };

  // 더보기 버튼
  const onClickReadMoreHandler = () => {
    setIsDetailReadMore((state) => !state);
  };

  // detail 로 넘어가기
  const onClickDetail = () => {
    // isDetail 이 true 일때는 detail로 넘어가지 않게 하기
    if (!isDetail) {
      navi("/vreadDetail/" + vreads_idx);
    }
  };

  // 날짜 관련

  let vreadDate: number = 0;
  if (vd_createDate) {
    vreadDate = vd_createDate;
  }

  // 만약 변경된 날짜가 있으면 변경됨 띄우기위한 코드
  let vd_modifyDateCheck: boolean = false;
  if (vd_modifyDate && vd_modifyDate !== 0) {
    vd_modifyDateCheck = true;
  }

  // 날짜 셋팅
  const vd = new Date(vreadDate);
  const vdString =
    vd.getFullYear() + " / " + (vd.getMonth() + 1) + " / " + vd.getDate();

  // 더보기 버튼 띄우기 셋팅
  let detailReadMore = false;
  if (vd_vtDetail && vd_vtDetail !== "" && vd_vtDetail.length > 150) {
    // 150 자 이상일때 텍스트 뒤 내용을 ... 처리

    //버튼 띄우기
    detailReadMore = true;

    // 만약 isDetail 이 true 로 왔다면 접힌 항목 펼쳐 보이게 하기
    if (isDetail && isDetail === "true") {
      setIsDetailReadMore(true);
    }
  }
  return (
    <Wrapper>
      {error !== "" && <Error>{error}</Error>}
      <Column>
        <PlofileWrap onClick={() => navi("/profile/" + mem_idx)}>
          <ProfileImgWrap>
            {mem_profileImageUrl ? (
              <ProfileImg src={mem_profileImageUrl} />
            ) : (
              <ProfileImg src="/profile1-svgrepo-com.svg" />
            )}
          </ProfileImgWrap>
          <Username>{mem_nickname}</Username>
        </PlofileWrap>
        <Payload onClick={onClickDetail} className="vt_title">
          {vd_vtTitle}{" "}
          {vd_modifyDateCheck == true && <ModifySpan>(Edited)</ModifySpan>}
        </Payload>
        {vd_vtDetail !== "" && (
          <>
            <Payload onClick={onClickDetail}>
              {detailReadMore
                ? isDetailReadMore
                  ? vd_vtDetail
                  : vd_vtDetail.slice(0, 150) + "..."
                : vd_vtDetail}
            </Payload>
            {detailReadMore && (
              <ReadMoreP onClick={onClickReadMoreHandler}>
                {isDetailReadMore ? "Show Less" : "Read More"}
              </ReadMoreP>
            )}
          </>
        )}
        {vd_subtag && (
          <SubTagPayload onClick={() => navi("/subtag/" + vd_subtag)}>
            SubTag : {vd_subtag}
          </SubTagPayload>
        )}
        <DatePayload>{vdString}</DatePayload>
        {isOnModifyBtn === true && (
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
            onToggleUpdate={props.onToggleUpdate}
          />
        )}
      </Column>

      <Column>{vd_media_1 ? <Photo src={vd_media_1} /> : null}</Column>
    </Wrapper>
  );
}
