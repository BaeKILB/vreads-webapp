/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import styled from "styled-components";
import Vread from "./vread";
import { IVread } from "../../fbCode/fdb";

import { getAllVreads } from "../springApi/springVreads";
import PostVreadForm from "./post-vread-from";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
  width: 100%;
`;

export default function VreadsList() {
  const [vreads, setVreads] = useState<IVread[]>([]);
  const [isReloadList, setIsReloadList] = useState(false);

  const onReloadToggle = () => {
    setIsReloadList((state) => !state);
  };

  useEffect(() => {
    // async 사용하는 내부 메서드 만들기
    // vreads 받아오기
    const fetchVreads = async () => {
      const result = await getAllVreads();

      setVreads(result.data);
    };

    // 메서드 실행
    fetchVreads();
    return () => {
      // 포커스 아웃시 구독 해제
      // unsubscribe && unsubscribe();
    };
  }, [isReloadList]);

  return (
    <Wrapper>
      <PostVreadForm onReloadToggle={onReloadToggle} />
      {vreads && vreads.map((vt) => <Vread key={vt.id} vread={vt} />)}
    </Wrapper>
  );
}
