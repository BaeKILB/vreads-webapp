// import { collection, addDoc } from "firebase/firestore";
// import { dbService } from "./fbase";

// // gkdahr cnrk
// export const dbVtdataAdd = async (vtData) => {
//   console.log("start");
//   if (!vtData) return { state: "error", error: "no vt_data" };

//   const { vtTitle, vtDetail } = vtData;

//   if (!vtTitle) return { state: "error", error: "no vt_title" };
//   console.log("try");

//   try {
//     const docRef = await addDoc(collection(dbService), "vt_data", {
//       vt_title: vtTitle,
//       vt_detail: vtDetail,
//       vt_date: new Date.now(),
//     });
//   } catch (error) {
//     console.error("Error adding document: ", error);
//     return { state: "error", error };
//   }
//   console.log("done");

//   return { state: "true" };
// };
