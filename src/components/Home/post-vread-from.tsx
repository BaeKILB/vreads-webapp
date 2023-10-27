/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

import { Input } from "../../style/Input";
import { Button } from "../../style/Button";
import { FileButton, FileInput, Form, Textarea } from "../../style/post-from";

import { auth } from "../../fbCode/fbase";
import { Error } from "../../style/auth-components";
import { addVread, updateVread } from "../../fbCode/fdb";

export default function PostVreadForm(props: any) {
  const [vtData, setVtData] = useState({
    vtTitle: "",
    vtDetail: "",
    vtSubtag: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);

  //===========
  // 만약 update 버튼을 눌러 진입했을때
  // vtData 에 값 넣어주기

  // isModify 은근히 많이써서 변수에 넣기
  let isModify = false;
  if (props.isModify) isModify = props.isModify;

  //useEffect 활용
  useEffect(() => {
    if (isModify) {
      const { vtTitle, vtDetail, vtSubtag } = props.vread;
      setVtData({ vtTitle, vtDetail, vtSubtag });
    }
  }, []);

  // vt_detail 줄 늘어나는것 구현
  // ts 에서 useRef 사용시나 null 값 들어가는 경우 반드시 데이터 형식 지정해야함
  const textarea = useRef<HTMLTextAreaElement>(null);

  const textAreaResizeHandler = (isReset: boolean | null) => {
    if (textarea !== null && textarea.current !== null) {
      textarea.current.style.height = "auto";
      textarea.current.style.height = isReset
        ? "100px"
        : textarea.current.scrollHeight + "px";
    }
  };

  // ==== 핸들러

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const onChangeHandler = (e: any) => {
    const {
      target: { name, value },
    } = e;

    if (name === "vt_title") {
      setVtData((state) => {
        return { ...state, vtTitle: value };
      });
    } else if (name === "vt_detail") {
      textAreaResizeHandler(false);
      setVtData((state) => {
        return { ...state, vtDetail: value };
      });
    } else if (name === "vt_subtag") {
      textAreaResizeHandler(false);
      setVtData((state) => {
        return { ...state, vtSubtag: value };
      });
    }
  };

  const onFileAddHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    const { vtTitle, vtDetail, vtSubtag } = vtData;
    const user = auth.currentUser;

    e.preventDefault();

    // 유효성 체크
    if (
      !user ||
      isLoading ||
      vtTitle === "" ||
      vtTitle.length > 120 ||
      vtDetail.length > 1500 ||
      vtSubtag.length > 20
    ) {
      if (vtTitle === "") setError("Vread need title");
      if (vtTitle.length >= 120)
        setError("Vread's title do not over length 120");
      if (vtDetail.length > 1500)
        setError("Vread's detail do not over length 1500 ");
      if (vtSubtag.length > 20)
        setError("Vread's detail do not over length 20 ");
      return;
    }

    setError("");
    setIsLoading(true);

    // db 동작 후 결과 받아올 변수
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;

    // 만약 update버튼을 눌러 해당컴포넌트를 불러온 상태라면 updateVread로 동작하게 하기
    if (isModify) {
      const { id } = props.vread;

      result = await updateVread(id, vtTitle, vtDetail, vtSubtag, file);

      // onUpdateReload 를 동작시켜 현재 업데이트된 항목부터 불러오게 하기
      if (props.onUpdateReload) props.onUpdateReload();
      console.log(result);
    } else {
      result = await addVread(
        user?.uid,
        user?.displayName,
        user?.photoURL,
        vtTitle,
        vtDetail,
        vtSubtag,
        file
      );
      console.log(result);
    }

    if (!result && result.state == false) {
      setError(result.error ? result.error : "Something error");

      setIsLoading(false);
      return;
    }

    // post 보내고 난 뒤 값들 초기화 시키기
    setVtData({ vtTitle: "", vtDetail: "", vtSubtag: "" });
    setFile(null);
    setIsLoading(false);
    textAreaResizeHandler(true);
    if (isModify) {
      props.closeForm();
    }
  };

  return (
    <>
      {error !== "" && <Error>{error}</Error>}
      <Form action="" onSubmit={onSubmitHandler}>
        <Input
          value={vtData.vtTitle}
          type="text"
          placeholder="title"
          name="vt_title"
          maxLength={120}
          className="title"
          onChange={onChangeHandler}
          required
        />
        <Textarea
          value={vtData.vtDetail}
          type="text"
          placeholder="What's on your mind?"
          name="vt_detail"
          className="detail"
          ref={textarea}
          onChange={onChangeHandler}
          maxLength={1500}
        />
        <Input
          value={vtData.vtSubtag}
          type="text"
          placeholder="Enter subtag"
          name="vt_subtag"
          maxLength={20}
          className="hash"
          onChange={onChangeHandler}
        />
        <FileButton htmlFor={isModify ? "modifyFile" : "file"}>
          {file ? "Photo added ✅" : "Add photo"}
        </FileButton>
        <FileInput
          onChange={onFileAddHandler}
          type="file"
          id={isModify ? "modifyFile" : "file"}
          accept="image/*"
        />
        <Button type="submit">
          {isModify ? "Vread update" : "Vread Post"}
        </Button>
      </Form>
    </>
  );
}
