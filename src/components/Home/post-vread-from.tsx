import { useRef, useState } from "react";

import { Input } from "../../style/Input";
import { Button } from "../../style/Button";
import { FileButton, FileInput, Form, Textarea } from "../../style/post-from";

import { FirebaseError } from "firebase/app";
import { addDoc, collection, updateDoc } from "firebase/firestore";
import { auth, db, storage } from "../../fbCode/fbase";
import { Error } from "../../style/auth-components";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export default function PostVreadForm(props) {
  const [vtData, setVtData] = useState({ vtTitle: "", vtDetail: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [file, setFile] = useState<File | null>(null);
  // vt_detail 줄 늘어나는것 구현
  const textarea = useRef();

  const textAreaResizeHandler = () => {
    textarea.current.style.height = "auto";
    textarea.current.style.height = textarea.current.scrollHeight + "px";
  };

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
    try {
      setError("");
      setIsLoading(true);
      const doc = await addDoc(collection(db, "vtDatas"), {
        vtTitle,
        vtDetail,
        createDate: Date.now(),
        username: user?.displayName || "Vaker",
      });

      // 이미지 파일 있는지 확인
      if (file) {
        // 업로드 준비
        const locationRef = ref(
          storage,
          "vtData/" + user?.uid + "-" + user?.displayName + "/" + doc.id
        );

        //업로드
        const result = await uploadBytes(locationRef, file);

        const fileUrl = await getDownloadURL(result.ref);

        await updateDoc(doc, { photo: fileUrl });
      }
      setVtData({ vtTitle: "", vtDetail: "" });
      setFile(null);
    } catch (e) {
      // 에러 형태가 firebase error일 경우
      if (e instanceof FirebaseError) setError(e.message);
      console.log(e.message);
    } finally {
      setIsLoading(false);
    }
    console.log(vtData);
  };
  // const result = await dbVtdataAdd(vtData).then((r) => {
  //   if (r) {
  //     if (r.state === "true") {
  //       setVtData({ vtTitle: "", vtDetail: "" });
  //     } else if (r.state === "error") {
  //       console.log(r.error);
  //     } else {
  //       console.log("etc");
  //       console.log(r);
  //     }
  //   }
  // });

  // dbService.collection("vt_data").add({
  //   vt_title: vtTitle,
  //   vt_detail: vtDetail,
  //   vt_date: Date.now(),
  // });

  //===style

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
        <FileButton htmlFor="file">
          {file ? "Photo added ✅" : "Add photo"}
        </FileButton>
        <FileInput
          onChange={onFileAddHandler}
          type="file"
          id="file"
          accept="image/*"
        />
        <Button type="submit">Vread Post</Button>
      </Form>
    </>
  );
}
