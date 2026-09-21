import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import EnrollmentServices from "../../../services/EnrollmentServices";
import "../../shared/shared.css";

function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const usersSnap = await getDocs(collection(db, "users"));
      const studentDocs = usersSnap.docs
        .map((d) => ({ uid: d.id, ...d.data() }))
        .filter((u) => u.role === "student");

      const withEnrollments = await Promise.all(
        studentDocs.map(async (s) => {
          const enrollments = await EnrollmentServices.ForUser(s.uid);
          return { ...s, enrollments };
        })
      );
      setStudents(withEnrollments);
      setLoading(false);
    })();
  }, []);

  const filtered = students.filter(
    (s) =>
      s.name?.toLowerCase().includes(search.toLowerCase()) ||
      s.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <div className="d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2">
        <h3 className="fw-bold mb-0">Students</h3>
        <input
          type="text"
          className="form-control"
          style={{ maxWidth: 260 }}
          placeholder="Search students..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="card border-0 shadow-sm rounded-4">
        <div className="card-body p-4">
          <div className="table-responsive">
            <table className="table table-hover align-middle">
              <thead className="table-light">
                <tr>
                  <th>#</th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Courses Joined</th>
                  <th>Avg. Progress</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => {
                  const avgProgress = s.enrollments.length
                    ? Math.round(s.enrollments.reduce((sum, e) => sum + (e.progress || 0), 0) / s.enrollments.length)
                    : 0;
                  return (
                    <tr key={s.uid}>
                      <td className="text-muted">{i + 1}</td>
                      <td className="fw-semibold">{s.name || "—"}</td>
                      <td>{s.email}</td>
                      <td>{s.enrollments.length}</td>
                      <td>{avgProgress}%</td>
                    </tr>
                  );
                })}
                {filtered.length === 0 && !loading && (
                  <tr>
                    <td colSpan="5" className="text-center text-muted py-4">No students found.</td>
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
export default AdminStudents;
