/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  and,
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./fbase";
import { FirebaseError } from "firebase/app";

// db에 유저 정보 추가
export const addUserInfo = async (
  id: string | undefined | null,
  name: string | undefined | null,
  email: string | undefined | null,
  loginType: number, // 0: email, 1: github, 2:google
  photoURL: string | undefined | null
) => {
  try {
    await addDoc(collection(db, "userInfo"), {
      id,
      name,
      email,
      loginType,
      photoURL,
    });
  } catch (e: any) {
    console.log(e.message);
    // 에러 형태가 firebase error일 경우
    if (e instanceof FirebaseError) return { state: false, error: e.message };

    return { state: false, error: "Someting error" };
  }
  return { state: true };
};

export const updateUserInfo = async (
  name: string | undefined | null,
  email: string | undefined | null,
  photoURL: string | null
) => {
  const user = auth.currentUser;
  const providerId = user?.providerData[0].providerId
    ? user?.providerData[0].providerId
    : "";
  try {
    let loginType = 0;
    if (providerId == "github.com") loginType = 1;
    else if (providerId == "google.com") loginType = 2;

    const queryUserInfo = query(
      collection(db, "userInfo"),
      and(
        where("email", "==", user?.email),
        where("loginType", "==", loginType)
      )
    );
    const data = await getDocs(queryUserInfo);

    const docId = await data.docs[0].data().id;
    const docRef = await doc(db, "userInfo", docId);
    await updateDoc(docRef, {
      name,
      email,
    });
    if (docRef && photoURL && photoURL != "") {
      await updateDoc(docRef, { photoURL });
    }
  } catch (e: any) {
    return { state: false, error: e.message };
  }
  return { state: true, error: "" };
};

export const getUserInfo = async (uid: string | undefined | null) => {
  try {
    // 해당 유저가 팔로우 하는 리스트
    const userQuery = query(collection(db, "userInfo"), where("id", "==", uid));

    const snapshot = await getDocs(userQuery);
    const users = snapshot.docs.map((doc) => {
      const { id, name, email, loginType, photoURL } = doc.data();
      return {
        uid: id,
        name,
        email,
        loginType,
        photoURL,
        id: doc.id,
      };
    });
    if (users.length < 0) {
      return { state: false, error: "error: Not found user" };
    } else {
      return { state: true, error: "", user: users[0] };
    }
  } catch (e: any) {
    console.log(e.message);
    if (e.message) return { state: false, error: e.message };
    else return { state: false, error: "Something error" };
  }
};
