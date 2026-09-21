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

const dbPath = "quizzes";

class QuizServices {
  async Add(data) {
    try {
      const payload = {
        courseId: data.courseId,
        courseName: data.courseName || "",
        topicId: data.topicId,
        topicName: data.topicName || "",
        title: data.title || "",
        description: data.description || "",
        questions: data.questions || [],
        passingMarks: data.passingMarks ?? 0,
        order: data.order ?? 0,
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

  // Quizzes belonging to one course only — this is the filter that keeps
  // a JS course's quizzes from ever showing up inside the HTML course.
  async ByCourse(courseId) {
    try {
      const q = query(collection(db, dbPath), where("courseId", "==", courseId));
      const docs = await getDocs(q);
      return docs.docs
        .map((el) => ({ id: el.id, ...el.data() }))
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  async ByTopic(courseId, topicId) {
    const all = await this.ByCourse(courseId);
    return all.filter((q) => q.topicId === topicId);
  }
}

export default new QuizServices();
