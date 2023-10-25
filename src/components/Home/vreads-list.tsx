import { useEffect, useState } from "react";
import styled from "styled-components";
import Vread from "./vread";
import { IVread } from "../../fbCode/fdb";
import { Unsubscribe } from "firebase/auth";
import { collection, onSnapshot, orderBy, query } from "firebase/firestore";
import { db } from "../../fbCode/fbase";

const Wrapper = styled.div`
  display: flex;
  gap: 10px;
  flex-direction: column;
`;

export default function VreadsList(props) {
  const [vreads, setVreads] = useState<IVread[]>([]);

  useEffect(() => {
    // onSnapshot 받을시 반환되는 구독 해지에 사용할 unsubscribe 받을 상수 만들기
    let unsubscribe: Unsubscribe | null = null; // Unsubscribe 또는 null 값이 될 수 있음 (초기값 null)

    // async 사용하는 내부 메서드 만들기
    // vreads 받아오기
    const fetchVreads = async () => {
      const vreadsQuery = query(
        collection(db, "vreads"),
        orderBy("createDate", "desc")
      );

      // 기존의 실시간 아닌 방식으로 snapshot 받아오기

      //   const snapshot = await getDocs(vreadsQuery);
      //   const vreads = snapshot.docs.map((doc) => {
      //     const { vtTitle, vtDetail, userId, username, photo, createDate } =
      //       doc.data();
      //     return { vtTitle, vtDetail, userId, username, photo, createDate };
      //   });

      // 실시간으로 받아오기
      // 쿼리문, snapshot 반환되는 콜백 함수
      unsubscribe = await onSnapshot(vreadsQuery, (snapshot) => {
        const vreads = snapshot.docs.map((doc) => {
          const {
            vtTitle,
            vtDetail,
            userId,
            username,
            photo,
            createDate,
            modifyDate,
          } = doc.data();
          return {
            vtTitle,
            vtDetail,
            userId,
            username,
            photo,
            createDate,
            modifyDate,
            id: doc.id,
          };
        });
        setVreads(vreads);

        console.log(vreads);
      });
    };

    // 메서드 실행
    fetchVreads();
    return () => {
      // 포커스 아웃시 구독 해제
      unsubscribe && unsubscribe();
    };
  }, []);

  return (
    <Wrapper>
      {vreads && vreads.map((vt) => <Vread key={vt.id} vread={vt} />)}
    </Wrapper>
  );
}
