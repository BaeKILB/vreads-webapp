import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  startAfter,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db, storage } from "./fbase";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { FirebaseError } from "firebase/app";
import { updateProfile } from "firebase/auth";

// Vread 게시글 인터페이스
export interface IVread {
  userId: string;
  username: string;
  photo: string;
  vtTitle: string;
  vtDetail: string;
  createDate: number;
  modifyDate: number;
  id: string;
}

// 특정 유저의 vread 리스트 받아오기
export const getVreads = async (
  uid: string,
  limitCount: number,
  limitStart: any | null // orderby 에 해당하는 값을 넣으면 거기서 부터 시작하여 로드함
) => {
  // 기존의 실시간 아닌 방식으로 snapshot 받아오기
  try {
    let vreadsQuery = query(
      collection(db, "vreads"),
      where("userId", "==", uid),
      orderBy("createDate", "desc"),
      limit(limitCount)
    );

    if (limitStart && limitStart !== "") {
      console.log("liststart");
      vreadsQuery = query(
        collection(db, "vreads"),
        where("userId", "==", uid),
        orderBy("createDate", "desc"),
        startAfter(limitStart),
        limit(limitCount)
      );
    }
    const snapshot = await getDocs(vreadsQuery);
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
        id: doc.id,
        vtTitle,
        vtDetail,
        userId,
        username,
        photo,
        createDate,
        modifyDate,
      };
    });
    return { state: true, vreads };
  } catch (e) {
    console.log(e.message);
    return { state: false, error: e.message };
  }
};

export const addVread = async (
  uid: string,
  displayName: string | null,
  vtTitle: string,
  vtDetail: string,
  file: any
) => {
  try {
    const doc = await addDoc(collection(db, "vreads"), {
      userId: uid,
      username: displayName || "Vaker",
      vtTitle,
      vtDetail,
      createDate: Date.now(),
      modifyDate: 0,
    });

    // 이미지 파일 있는지 확인
    if (file) {
      // 업로드 준비
      const locationRef = ref(storage, "vreads/photo/" + uid + "/" + doc.id);

      //업로드
      const result = await uploadBytes(locationRef, file);

      const fileUrl = await getDownloadURL(result.ref);

      await updateDoc(doc, { photo: fileUrl });
    }
  } catch (e) {
    console.log(e.message);
    // 에러 형태가 firebase error일 경우
    if (e instanceof FirebaseError) return { state: false, error: e.message };

    return { state: false, error: "Someting error" };
  }
  return { state: true };
};

export const updateVread = async (
  docId: string,
  vtTitle: string,
  vtDetail: string,
  file: any
) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const docRef = doc(db, "vreads", docId);
    await updateDoc(docRef, {
      username: user.displayName,
      vtTitle,
      vtDetail,
      modifyDate: Date.now(),
    });
    console.log("1");
    // 이미지 파일 있는지 확인
    if (file) {
      // 만약 기존에 photo가 있다면 먼저 지우기
      //사진삭제 준비
      const photoref = ref(storage, "vreads/photo/" + user?.uid + "/" + docId);
      //사진 삭제
      await deleteObject(photoref);

      console.log("2");
      // 업로드 준비
      const locationRef = ref(
        storage,
        "vreads/photo/" + user?.uid + "/" + docId
      );

      //업로드
      const result = await uploadBytes(locationRef, file);

      const fileUrl = await getDownloadURL(result.ref);

      await updateDoc(docRef, { photo: fileUrl });
    }
  } catch (e) {
    console.log(e.message);
    // 에러 형태가 firebase error일 경우
    if (e instanceof FirebaseError) return { state: false, error: e.message };

    return { state: false, error: "Someting error" };
  }
  return { state: true };
};

export const deleteVread = async (
  docId: string,
  uid: string | null,
  photo: string | null
) => {
  try {
    await deleteDoc(doc(db, "vreads", docId));
    if (photo) {
      //사진삭제 준비
      const photoref = ref(storage, "vreads/photo/" + uid + "/" + docId);
      //사진 삭제
      await deleteObject(photoref);
    }
  } catch (e) {
    console.log(e.message);
    return { state: false, error: e.message };
  }
  return { state: true };
};

//profileData = {displayName, profileImg} 항목 존재 여부 체크후 각각 업데이트 = 하나만 넣어도 됨
export const updateUser = async (profileData: any) => {
  const user = auth.currentUser;

  if (!user)
    return { state: false, error: "Do not update user Please login again" };
  if (!profileData) return { state: false, error: "Do not have update data" };

  let displayName = "";
  let photoURL = "";

  if (profileData.displayName) {
    displayName = profileData.displayName;
  }
  try {
    // 이미지 파일 있는지 확인
    if (profileData.profileImg) {
      const file = profileData.profileImg;

      // 사진 넣기위한 경로지정
      const photoref = ref(storage, "profiles/photo/" + user.uid);

      // 사진 업로드 및 파일 url 받기
      const result = await uploadBytes(photoref, file);
      photoURL = await getDownloadURL(result.ref);
    }
    //프로필 업데이트

    displayName !== "" && (await updateProfile(user, { displayName }));
    photoURL !== "" && (await updateProfile(user, { photoURL }));

    return { state: true, error: "", photoURL };
  } catch (e) {
    console.log(e.message);
    if (e instanceof FirebaseError) {
      return { state: false, error: e.message };
    }
    return { state: false, error: "Something Wrong" };
  }
};
