/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import styled from "styled-components";
import Vread from "./vread";

import {
  IVread,
  SET_PAGE_LIST_LIMIT_INIT,
  START_COUNT_INIT,
  getAllVreads,
} from "../springApi/springVreads";
import PostVreadForm from "./post-vread-from";
import { Error } from "../../style/etc_style";
import { Button } from "../../style/Button";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
`;

export default function VreadsList() {
  const [startCount, setStartCount] = useState(START_COUNT_INIT);
  const [pageListLimit, setPageListLimit] = useState(SET_PAGE_LIST_LIMIT_INIT);
  const [vreads, setVreads] = useState<IVread[]>([]);
  const [isReloadList, setIsReloadList] = useState(false);
  const [isReloadBtn, setIsReloadBtn] = useState(false);
  const [error, setError] = useState("");

  const onReloadToggle = () => {
    setIsReloadList((state) => !state);
  };

  const fetchVreads = async (isSearchMore: boolean) => {
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

    setError("");
    const result = await getAllVreads(startLimit, pageLimit);

    if (result.state !== "true") {
      setError(result.error);
      return;
    }

    if (!result.data || result.data.length <= 0) {
      return;
    }
    if (isSearchMore) setVreads((state) => [...state, ...result.data]);
    else setVreads(result.data);
  };

  const onLoadMore = () => {
    setIsReloadBtn(true);
    fetchVreads(true);
  };
  const onReloadClick = () => {
    setIsReloadBtn(false);
    fetchVreads(false);
  };

  useEffect(() => {
    // async 사용하는 내부 메서드 만들기
    // vreads 받아오기

    // 메서드 실행
    fetchVreads(false);
    return () => {
      // 포커스 아웃시 구독 해제
      // unsubscribe && unsubscribe();
    };
  }, [isReloadList]);

  return (
    <Wrapper>
      <PostVreadForm onReloadToggle={onReloadToggle} />
      {isReloadBtn === true && (
        <Button onClick={onReloadClick}>Reload Vreads</Button>
      )}
      {!error && error !== "" && <Error>{error}</Error>}
      {vreads && vreads.map((vt) => <Vread key={vt.vreads_idx} vread={vt} />)}
      {vreads && vreads.length > 0 ? (
        <Button onClick={onLoadMore}>Load more</Button>
      ) : (
        ""
      )}
    </Wrapper>
  );
}
