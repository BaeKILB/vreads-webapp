import { useEffect, useState } from "react";
import styled from "styled-components";
import { Error } from "../../style/etc_style";
import Vread from "../../components/Home/vread";
import {
  IVread,
  getVreadDetail,
} from "../../components/springApi/springVreads";
import { useParams } from "react-router-dom";
import { Title } from "../../style/auth-components";
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
  margin-top: 10px;
  width: 100%;

  & > div {
    width: 100%;
  }
`;

// const TimelineWrapper = styled.div`
//   display: flex;
//   gap: 10px;
//   flex-direction: column;
//   width: 100%;
// `;

export default function VreadDetail() {
  //   const [startCount, setStartCount] = useState(START_COUNT_INIT);
  //   const [pageListLimit, setPageListLimit] = useState(SET_PAGE_LIST_LIMIT_INIT);
  // const [commentVreads, setSearchVreads] = useState<IVread[]>([]);

  const [error, setError] = useState("");
  const [isOnUpdate, setIsOnUpdate] = useState(false);
  const [vread, setVread] = useState<IVread>();
  const { paramVreadIdx } = useParams();

  const onToggleUpdate = () => {
    setIsOnUpdate((state) => !state);
  };

  const onVreadDetail = async (vreadIdx: string) => {
    const result = await getVreadDetail(vreadIdx);

    if (result.state !== "true") {
      setError(result.error);
    } else {
      setVread(result.data);
    }
  };

  useEffect(() => {
    if (paramVreadIdx) onVreadDetail(paramVreadIdx);
  }, [isOnUpdate]);

  return (
    <Wrapper>
      <Title>Vread Detail</Title>
      {error !== "" && <Error>{error}</Error>}

      {vread && (
        <Vread
          key={vread.vreads_idx + "_detail"}
          vread={vread}
          isDetail={true}
          onToggleUpdate={onToggleUpdate}
        />
      )}
    </Wrapper>
  );
}

// <TimelineWrapper>
// {searchVreads.length <= 0 && (
//   <p>There is no Vread matching your search term.</p>
// )}
// {searchVreads.length > 0 &&
//   searchVreads.map((vread) => (
//     <Vread key={vread.vreads_idx + "_search"} vread={vread} />
//   ))}
// {/* {searchVreads.length > 0 && (
//   <SearchBtn onClick={() => onSearchHandler(true)}>Load More</SearchBtn>
// )} */}
// </TimelineWrapper>
