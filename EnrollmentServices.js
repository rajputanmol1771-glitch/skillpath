import { doc, getDoc, getDocs, collection, query, where, setDoc, updateDoc } from "firebase/firestore";
import { db } from "../components/firebase";

const dbPath = "enrollments";
const idFor = (uid, courseId) => `${uid}_${courseId}`;

class EnrollmentServices {
  async Get(uid, courseId) {
    try {
      const snap = await getDoc(doc(db, dbPath, idFor(uid, courseId)));
      if (!snap.exists()) return null;
      return { id: snap.id, ...snap.data() };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async Join(uid, course) {
    try {
      const existing = await this.Get(uid, course.id);
      if (existing) return existing;
      const payload = {
        uid,
        courseId: course.id,
        courseName: course.title,
        enrolledAt: new Date(),
        completed: false,
        progress: 0,
        completedQuizIds: [],
        scores: {},
        latestScore: null,
      };
      await setDoc(doc(db, dbPath, idFor(uid, course.id)), payload);
      return payload;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async ForUser(uid) {
    try {
      const q = query(collection(db, dbPath), where("uid", "==", uid));
      const docs = await getDocs(q);
      return docs.docs.map((el) => ({ id: el.id, ...el.data() }));
    } catch (error) {
      console.log(error);
      return [];
    }
  }

  // Records a quiz attempt result against a student's enrollment and
  // recalculates course progress against the course's total quiz count.
  async RecordQuizResult(uid, courseId, quizId, result, totalQuizzesInCourse) {
    try {
      const ref = doc(db, dbPath, idFor(uid, courseId));
      const snap = await getDoc(ref);
      if (!snap.exists()) return 0;
      const data = snap.data();

      const completedQuizIds = new Set(data.completedQuizIds || []);
      completedQuizIds.add(quizId);

      const scores = { ...(data.scores || {}) };
      scores[quizId] = result;

      const progress = totalQuizzesInCourse > 0
        ? Math.round((completedQuizIds.size / totalQuizzesInCourse) * 100)
        : 0;

      await updateDoc(ref, {
        completedQuizIds: Array.from(completedQuizIds),
        scores,
        latestScore: result.percent,
        progress,
        completed: progress >= 100,
      });
      return 1;
    } catch (error) {
      console.log(error);
      return 0;
    }
  }
}

export default new EnrollmentServices();
