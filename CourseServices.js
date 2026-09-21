import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../components/firebase";

const dbPath = "courses";

class CourseServices {
  async Add(data) {
    try {
      const payload = {
        title: data.title || "",
        description: data.description || "",
        aboutText: data.aboutText || "",
        image: data.image || "",
        subject: data.subject || "",
        difficulty: data.difficulty || "Beginner",
        duration: data.duration || "",
        objectives: data.objectives || [],
        topics: data.topics || [],
        status: data.status ?? true,
        createdAt: new Date(),
      };
      const ref = await addDoc(collection(db, dbPath), payload);
      return ref.id;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async Update(id, data) {
    try {
      await updateDoc(doc(db, dbPath, id), data);
      return 1;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async Delete(id) {
    try {
      await deleteDoc(doc(db, dbPath, id));
      return 1;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }

  async Get(id) {
    try {
      const snap = await getDoc(doc(db, dbPath, id));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async All() {
    try {
      const docs = await getDocs(collection(db, dbPath));
      return docs.docs.map((el) => ({ id: el.id, ...el.data() }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async Active() {
    try {
      const q = query(collection(db, dbPath), where("status", "==", true));
      const docs = await getDocs(q);
      return docs.docs.map((el) => ({ id: el.id, ...el.data() }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }
}

export default new CourseServices();
