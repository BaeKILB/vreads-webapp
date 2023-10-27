/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "./fbase";

import { FirebaseError } from "firebase/app";
import { getUserInfo } from "./fLogin";

// 유저 인터페이스
export interface IUser {
  userId: string;
  username: string;
  userPhoto: string;
  id: string;
}
// 팔로우 인터페이스
export interface IFollow {
  followerId: string;
  followerName: string;
  followerPhoto: string;
  followId: string;
  followName: string;
  followPhoto: string;
  createDate: number;
  id: string;
}

// 유저 팔로우 받아오기
export const getFollows = async (
  queryType: number, // vread리스트 받아오는 쿼리 형식 지정 0: 기본, 1: uid 으로만 검색, 2: uid+ limitstart, 3:키워드 제목 검색, 4: 키워드 내용 검색
  uid: string | undefined | null
) => {
  // 기존의 실시간 아닌 방식으로 snapshot 받아오기
  try {
    // 해당 유저가 팔로우 하는 리스트
    let followsQuery = query(
      collection(db, "follows"),
      where("followerId", "==", uid),
      orderBy("username", "desc")
    );
    // 해당 유저 를 팔로우 하는 팔로워 리스트
    if (uid && queryType == 1) {
      followsQuery = query(
        collection(db, "vreads"),
        where("followId", "==", uid),
        orderBy("createDate", "desc")
      );
    }

    const snapshot = await getDocs(followsQuery);
    const follows = snapshot.docs.map((doc) => {
      const {
        followerId,
        followerName,
        followerPhoto,
        followId,
        followName,
        followPhoto,
        createDate,
      } = doc.data();
      return {
        id: doc.id,
        followerId,
        followerName,
        followerPhoto,
        followId,
        followName,
        followPhoto,
        createDate,
      };
    });
    return { state: true, follows };
  } catch (e: any) {
    console.log(e.message);
    return { state: false, error: e.message };
  }
};

export const addFollow = async (uid: string | undefined, followUid: string) => {
  const user = auth.currentUser;
  const followerUserData = await getUserInfo(uid);
  const followUserData = await getUserInfo(followUid);
  if (
    !user ||
    followerUserData.state === false ||
    followUserData.state === false
  )
    return { state: false, error: "Do not find user" };

  const followerUser = followerUserData.user;
  const followUser = followUserData.user;

  try {
    await addDoc(collection(db, "follows"), {
      userId: uid,
      followerId: followerUser?.id,
      followerName: followerUser?.name,
      followerPhoto: followerUser?.photoURL,
      followId: followUser?.id,
      followName: followUser?.name,
      followPhoto: followUser?.photoURL,
      createDate: Date.now(),
    });

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (e: any) {
    console.log(e.message);
    // 에러 형태가 firebase error일 경우
    if (e instanceof FirebaseError) return { state: false, error: e.message };

    return { state: false, error: "Someting error" };
  }
  return { state: true };
};

export const updateFollow = async (
  docId: string,
  uid: string | undefined,
  followUid: string
) => {
  const user = auth.currentUser;
  const followerUserData = await getUserInfo(uid);
  const followUserData = await getUserInfo(followUid);
  if (
    !user ||
    followerUserData.state === false ||
    followUserData.state === false
  )
    return { state: false, error: "Do not find user" };

  const followerUser = followerUserData.user;
  const followUser = followUserData.user;

  try {
    const docRef = doc(db, "follows", docId);
    await updateDoc(docRef, {
      followerId: followerUser?.id,
      followerName: followerUser?.name,
      followerPhoto: followerUser?.photoURL,
      followId: followUser?.id,
      followName: followUser?.name,
      followPhoto: followUser?.photoURL,
    });
  } catch (e: any) {
    console.log(e.message);
    // 에러 형태가 firebase error일 경우
    if (e instanceof FirebaseError) return { state: false, error: e.message };

    return { state: false, error: "Someting error" };
  }
  return { state: true };
};

export const deleteFollow = async (docId: string) => {
  const user = auth.currentUser;
  if (!user) return;
  try {
    await deleteDoc(doc(db, "vreads", docId));
  } catch (e: any) {
    console.log(e.message);
    return { state: false, error: e.message };
  }
  return { state: true };
};
