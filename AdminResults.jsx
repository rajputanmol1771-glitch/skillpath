import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import "../../shared/shared.css";

function AdminResults() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const enrollSnap = await getDocs(collection(db, "enrollments"));
      const usersSnap = await getDocs(collection(db, "users"));
      const usersById = {};
      usersSnap.docs.forEach((d) => { usersById[d.id] = d.data(); });

      const flat = [];
      enrollSnap.docs.forEach((d) => {
        const e = d.data();
        const student = usersById[e.uid];
        Object.entries(e.scores || {}).forEach(([quizId, result]) => {
          flat.push({
            key: `${d.id}_${quizId}`,
            studentName: student?.name || student?.email || e.uid,
            courseName: e.courseName,
            percent: result.percent,
            passed: result.passed,
            attemptedAt: result.attemptedAt,
          });
        });
      });
      flat.sort((a, b) => new Date(b.attemptedAt || 0) - new Date(a.attemptedAt || 0));
      setRows(flat);
      setLoading(false);
    })();
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-4">Quiz Results</h3>
      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>Student</th>
                  <th>Course</th>
                  <th>Score</th>
                  <th>Result</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.key}>
                    <td className="fw-semibold">{r.studentName}</td>
                    <td>{r.courseName}</td>
                    <td>{r.percent}%</td>
                    <td>
                      <span className={`lg-badge ${r.passed ? "active" : "draft"}`}>
                        {r.passed ? "Passed" : "Failed"}
                      </span>
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && !loading && (
                  <tr>
                    <td colSpan="4" className="text-center text-muted py-4">No quiz attempts yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
export default AdminResults;
