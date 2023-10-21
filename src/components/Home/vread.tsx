import styled from "styled-components";
import { IVread } from "./vreads-list";
const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
  &.vt_title {
    font-size: 24px;
    font-weight: bold;
    color: #fcbb79;
  }
`;

export default function Vread(props) {
  const { vtTitle, vtDetail, userId, username, photo, createDate } =
    props.vtData;

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload className="vt_title">{vtTitle}</Payload>
        {vtDetail !== "" && <Payload>{vtDetail}</Payload>}
      </Column>
      {photo ? (
        <Column>
          <Photo src={photo} />
        </Column>
      ) : null}
    </Wrapper>
  );
}
