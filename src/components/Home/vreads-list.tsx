import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../../fbCode/fbase";
import styled from "styled-components";
import Vread from "./vread";

export interface IVread {
  photo: string;
  vtTitle: string;
  vtDetail: string;
  userId: string;
  username: string;
  createDate: number;
}

export default function VreadsList(props) {
  const [vreads, setVreads] = useState<IVread[]>([]);
  const fetchVreads = async () => {
    const vreadsQuery = query(
      collection(db, "vtDatas"),
      orderBy("createDate", "desc")
    );
    const spanshot = await getDocs(vreadsQuery);
    const vreads = spanshot.docs.map((doc) => {
      const { vtTitle, vtDetail, userId, username, photo, createDate } =
        doc.data();
      return { vtTitle, vtDetail, userId, username, photo, createDate };
    });
    setVreads(vreads);
  };
  useEffect(() => {
    fetchVreads();
  }, []);

  const Wrapper = styled.div``;

  return (
    <Wrapper>
      {vreads.map((vt) => (
        <Vread vtData={vt} />
      ))}
    </Wrapper>
  );
}
