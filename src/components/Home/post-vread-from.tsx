import { useEffect, useRef, useState } from "react";

import { Input } from "../../style/Input";
import { Button } from "../../style/Button";
import { FileButton, FileInput, Form, Textarea } from "../../style/post-from";

import { auth } from "../../fbCode/fbase";
import { Error } from "../../style/auth-components";
import { addVread, updateVread } from "../../fbCode/fdb";

export default function PostVreadForm(props) {
  const [vtData, setVtData] = useState({ vtTitle: "", vtDetail: "" });
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
      const { vtTitle, vtDetail } = props.vread;
      setVtData({ vtTitle, vtDetail });
    }
  }, []);

  // vt_detail 줄 늘어나는것 구현
  const textarea = useRef();

  const textAreaResizeHandler = () => {
    textarea.current.style.height = "auto";
    textarea.current.style.height = textarea.current.scrollHeight + "px";
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
      textAreaResizeHandler();
      setVtData((state) => {
        return { ...state, vtDetail: value };
      });
    }
  };

  const onFileAddHandler = (e) => {
    const { files } = e.target;
    if (files && files.length === 1) {
      setFile(files[0]);
    }
  };

  const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    const { vtTitle, vtDetail } = vtData;
    const user = auth.currentUser;

    e.preventDefault();

    // 유효성 체크
    if (
      isLoading ||
      vtTitle === "" ||
      vtTitle.length > 120 ||
      vtDetail.length > 10000
    )
      return;

    setError("");
    setIsLoading(true);

    // db 동작 후 결과 받아올 변수
    let result: any;

    // 만약 update버튼을 눌러 해당컴포넌트를 불러온 상태라면 updateVread로 동작하게 하기
    if (isModify) {
      const { id } = props.vread;

      result = await updateVread(id, vtTitle, vtDetail, file);

      // onUpdateReload 를 동작시켜 현재 업데이트된 항목부터 불러오게 하기
      if (props.onUpdateReload) props.onUpdateReload();
      console.log(result);
    } else {
      result = await addVread(
        user?.uid,
        user?.displayName,
        vtTitle,
        vtDetail,
        file
      );
      console.log(result);
    }

    if (result.state && result.state == true) {
      setVtData({ vtTitle: "", vtDetail: "" });
      setFile(null);
    } else if (result.state == false) {
      setError(result.error ? result.error : "Something error");

      setIsLoading(false);
      return;
    }

    setIsLoading(false);
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
          maxLength={10000}
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
