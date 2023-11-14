/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";

import { Input } from "../../style/Input";
import { Button } from "../../style/Button";
import {
  BtnWarp,
  FileButton,
  FileInput,
  Form,
  Textarea,
} from "../../style/post-from";

import { Error } from "../../style/auth-components";
import {
  VT_DETAIL_MAX_LENGTH,
  VT_SUBTAG_MAX_LENGTH,
  VT_TITLE_MAX_LENGTH,
  addVread,
  updateVread,
} from "../springApi/springVreads";

export default function PostVreadForm(props: any) {
  // vread 데이터 담을 state
  const [vtData, setVtData] = useState({
    vd_vtTitle: "",
    vd_vtDetail: "",
    vd_subtag: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState("");
  // 이미지 파일
  const [file, setFile] = useState<File | null>(null);

  // 만약 업데이트가 아닌 경우 게시글 올렸을때
  // redux 를 이용해 다시 로드하는 코드를 만들기
  // const dispatch = useDispatch();

  // redux 에 있는 state 중 하나 가져오기
  // const isReload = useSelector(
  //   (state: vreadsGState) => state.ishomeVdListReload
  // );

  // const reloadList = () => {
  //   dispatch(vdGStateActions.ishomeVdListReload(!isReload));
  // };
  const reloadList = props.onReloadToggle;

  //===========
  // 만약 update 버튼을 눌러 진입했을때
  // vtData 에 값 넣어주기

  // isModify 은근히 많이써서 변수에 넣기
  let isModify = false;
  if (props.isModify) isModify = props.isModify;

  // modify (update) 상태일때 vreads_idx 받아오기
  let vreads_idx = "";
  if (isModify === true && props.vread.vreads_idx) {
    vreads_idx = props.vread.vreads_idx;
  }
  console.log(props.vread);
  console.log(vreads_idx);

  //useEffect 활용
  useEffect(() => {
    if (isModify) {
      const { vd_vtTitle, vd_vtDetail, vd_subtag } = props.vread;
      setVtData({ vd_vtTitle, vd_vtDetail, vd_subtag });
    }
  }, []);

  // vd_vd_vtDetail 줄 늘어나는것 구현
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

    if (name === "vd_vd_vtTitle") {
      setVtData((state) => {
        return { ...state, vd_vtTitle: value };
      });
    } else if (name === "vd_vd_vtDetail") {
      textAreaResizeHandler(false);
      setVtData((state) => {
        return { ...state, vd_vtDetail: value };
      });
    } else if (name === "vd_subtag") {
      textAreaResizeHandler(false);
      setVtData((state) => {
        return { ...state, vd_subtag: value };
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
    const { vd_vtTitle, vd_vtDetail, vd_subtag } = vtData;

    e.preventDefault();
    if (isLoading) return;
    setError("");
    setIsLoading(true);

    // db 동작 후 결과 받아올 변수
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let result: any;

    // 만약 update버튼을 눌러 해당컴포넌트를 불러온 상태라면 updateVread로 동작하게 하기
    if (isModify) {
      // vread 업데이트
      result = await updateVread(
        vreads_idx,
        vd_vtTitle,
        vd_vtDetail,
        vd_subtag,
        file
      );
      console.log(result);
    } else {
      // vread 추가
      result = await addVread(vd_vtTitle, vd_vtDetail, vd_subtag, file);
      console.log(result);
      // home 의 vreads list 다시 로딩
      reloadList();
    }

    if (!result || result.state !== "true") {
      setError(result.error ? result.error : "Something error");

      setIsLoading(false);
      return;
    }

    // post 보내고 난 뒤 값들 초기화 시키기
    setVtData({ vd_vtTitle: "", vd_vtDetail: "", vd_subtag: "" });
    setFile(null);
    setIsLoading(false);
    textAreaResizeHandler(true);

    if (isModify) {
      // updateVread 동작 후 onToggleUpdate 로 페이지 리로딩 동작하기
      if (props.onToggleUpdate) props.onToggleUpdate();
      props.closeForm();
    }
  };

  return (
    <>
      {error !== "" && <Error>{error}</Error>}
      <Form action="" onSubmit={onSubmitHandler}>
        <Input
          value={vtData.vd_vtTitle}
          type="text"
          placeholder="title"
          name="vd_vd_vtTitle"
          maxLength={VT_TITLE_MAX_LENGTH}
          className="title"
          onChange={onChangeHandler}
          required
        />
        <Textarea
          value={vtData.vd_vtDetail}
          type="text"
          placeholder="What's on your mind?"
          name="vd_vd_vtDetail"
          className="detail"
          ref={textarea}
          onChange={onChangeHandler}
          maxLength={VT_DETAIL_MAX_LENGTH}
        />
        <BtnWarp>
          <Input
            value={vtData.vd_subtag}
            type="text"
            placeholder="Enter subtag"
            name="vd_subtag"
            maxLength={VT_SUBTAG_MAX_LENGTH}
            className="hash"
            onChange={onChangeHandler}
          />
          <FileButton htmlFor={isModify ? "modifyFile1" : "file1"}>
            {file ? (
              <img src={URL.createObjectURL(file)} alt="Image upload file" />
            ) : (
              <img src="/image-plus-svgrepo-com.svg" alt="Image upload" />
            )}
          </FileButton>
          <FileInput
            onChange={onFileAddHandler}
            type="file"
            id={isModify ? "modifyFile1" : "file1"}
            accept="image/*"
          />
          <Button type="submit">
            {isModify ? "Vread update" : "Vread Post"}
          </Button>
        </BtnWarp>
      </Form>
    </>
  );
}
