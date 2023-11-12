/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  limit,
  or,
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
import { updateUserInfo } from "./fLogin";

// 특정 유저의 vread 리스트 받아오기
export const getVreads = async (
  queryType: number, // vread리스트 받아오는 쿼리 형식 지정 0: 기본, 1: uid 으로만 검색, 2: uid+ limitstart, 3:키워드 제목 검색, 4: 키워드 내용 검색
  uid: string | undefined | null,
  limitCount: number,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  limitStart: any | null, // orderby 에 해당하는 값을 넣으면 거기서 부터 시작하여 로드함
  searchKeyword: string | undefined | null
) => {
  // 기존의 실시간 아닌 방식으로 snapshot 받아오기
  try {
    let vreadsQuery = query(
      collection(db, "vreads"),
      orderBy("createDate", "desc")
    );
    if (uid && queryType == 1) {
      vreadsQuery = query(
        collection(db, "vreads"),
        where("userId", "==", uid),
        orderBy("createDate", "desc"),
        limit(limitCount)
      );
    }

    if (limitStart && limitStart !== "" && queryType == 2) {
      vreadsQuery = query(
        collection(db, "vreads"),
        where("userId", "==", uid),
        orderBy("createDate", "desc"),
        limit(limitCount)
      );
    }

    if (searchKeyword && queryType == 3) {
      vreadsQuery = query(
        collection(db, "vreads"),
        or(
          where("vtTitle", "==", searchKeyword),
          where("vtDetail", "==", searchKeyword)
        ),
        orderBy("createDate", "desc"),
        startAfter(limitStart),
        limit(limitCount)
      );
    } else if (searchKeyword && queryType == 4) {
      vreadsQuery = query(
        collection(db, "vreads"),
        where("username", "==", searchKeyword),
        orderBy("createDate", "desc"),
        startAfter(limitStart),
        limit(limitCount)
      );
    } else if (searchKeyword && queryType == 5) {
      vreadsQuery = query(
        collection(db, "vreads"),
        where("vtSubtag", "==", searchKeyword),
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
        vtSubtag,
        userId,
        username,
        photo,
        userPhoto,
        createDate,
        modifyDate,
      } = doc.data();
      return {
        id: doc.id,
        vtTitle,
        vtDetail,
        vtSubtag,
        userId,
        username,
        userPhoto,
        photo,
        createDate,
        modifyDate,
      };
    });
    return { state: true, vreads };
  } catch (e: any) {
    console.log(e.message);
    return { state: false, error: e.message };
  }
};

export const addVread = async (
  uid: string | undefined,
  displayName: string | null | undefined,
  userPhoto: string | null | undefined,
  vtTitle: string,
  vtDetail: string,
  vtSubtag: string,
  file: File | null
) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const doc = await addDoc(collection(db, "vreads"), {
      userId: uid,
      username: displayName || "Vaker",
      userPhoto: userPhoto || "",
      vtTitle,
      vtDetail,
      vtSubtag,
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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
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
  vtSubtag: string,
  file: any
) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    const docRef = doc(db, "vreads", docId);
    await updateDoc(docRef, {
      username: user.displayName,
      userPhoto: user.photoURL,
      vtTitle,
      vtDetail,
      vtSubtag,
      modifyDate: Date.now(),
    });
    // 이미지 파일 있는지 확인
    if (file) {
      // 만약 기존에 photo가 있다면 먼저 지우기
      //사진삭제 준비
      const photoref = ref(storage, "vreads/photo/" + user?.uid + "/" + docId);
      //사진 삭제
      await deleteObject(photoref);

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
  } catch (e: any) {
    console.log(e.message);
    // 에러 형태가 firebase error일 경우
    if (e instanceof FirebaseError) return { state: false, error: e.message };

    return { state: false, error: "Someting error" };
  }
  return { state: true };
};

export const deleteVread = async (
  docId: string,
  uid: string | undefined | null,
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
  } catch (e: any) {
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

    await updateUserInfo(user?.displayName, user?.email, user?.photoURL);
    // 현 vread 들의 이름, photoURL 바꾸기

    return { state: true, error: "", photoURL };
  } catch (e: any) {
    console.log(e.message);
    if (e instanceof FirebaseError) {
      return { state: false, error: e.message };
    }
    return { state: false, error: "Something Wrong" };
  }
};
