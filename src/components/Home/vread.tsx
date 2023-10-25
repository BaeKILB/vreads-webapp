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
  border: 1px solid #fcbb79;
  border-radius: 5px;
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
  color: white;
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

export default function Vread(props) {
  const [error, setError] = useState("");
  const [clickUpdateBtn, setClickUpdateBtn] = useState(false);

  const {
    vtTitle,
    vtDetail,
    userId,
    username,
    photo,
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
  };

  // 날짜 관련

  let vreadDate: number = 0;
  if (createDate) {
    vreadDate = createDate;
  }
  let modifyDateCheck: boolean = false;
  if (modifyDate && modifyDate !== 0) {
    modifyDateCheck = true;
  }

  const vd = new Date(vreadDate);
  const vdString =
    vd.getFullYear() + " / " + (vd.getMonth() + 1) + " / " + vd.getDate();

  return (
    <Wrapper>
      {error !== "" && <Error>{error}</Error>}
      <Column>
        <Username>{username}</Username>
        <Payload className="vt_title">
          {vtTitle}{" "}
          {modifyDateCheck == true && <ModifySpan>(Edited)</ModifySpan>}
        </Payload>
        {vtDetail !== "" && <Payload>{vtDetail}</Payload>}
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

      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}