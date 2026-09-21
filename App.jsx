import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./components/admin/pages/Home";
import Admin_layout from "./components/admin/Admin_layout";
import Student_layout from "./components/Student_layout";
import About from "./components/admin/pages/About";
import Contact from "./components/admin/pages/Contact";
import Courses from "./components/admin/pages/Courses";
import Login from "./components/admin/pages/Login";
import Register from "./components/admin/pages/Register";
import { ToastContainer } from "react-toastify";
import { ProtectedRoute } from "./components/ProtectedRoute";

import CourseDetails from "./components/CourseDetails";
import StudentDashboard from "./components/student/StudentDashboard";
import QuizAttempt from "./components/student/QuizAttempt";

import AdminPanelLayout from "./components/admin/AdminPanelLayout";
import AdminDashboard from "./components/admin/pages/AdminDashboard";
import ManageCourses from "./components/admin/pages/ManageCourses";
import AddCourse from "./components/admin/pages/AddCourse";
import ManageQuizzes from "./components/admin/pages/ManageQuizzes";
import AddQuiz from "./components/admin/pages/AddQuiz";
import AdminStudents from "./components/admin/pages/AdminStudents";
import AdminResults from "./components/admin/pages/AdminResults";

function App(){
  return(
    <>
      <BrowserRouter>
        <Routes>

          {/* Public routes */}
          <Route path="/" element={<Admin_layout />}>
            <Route index element={<Home />} />
            <Route path="about" element={<About />} />
            <Route path="courses" element={<Courses />} />
            <Route path="courses/:id" element={<CourseDetails />} />
            <Route path="contact" element={<Contact />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </Route>

          {/* Admin panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminPanelLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminDashboard />} />
            <Route path="courses" element={<ManageCourses />} />
            <Route path="courses/new" element={<AddCourse />} />
            <Route path="courses/:id/edit" element={<AddCourse />} />
            <Route path="quizzes" element={<ManageQuizzes />} />
            <Route path="quizzes/new" element={<AddQuiz />} />
            <Route path="quizzes/:id/edit" element={<AddQuiz />} />
            <Route path="students" element={<AdminStudents />} />
            <Route path="results" element={<AdminResults />} />
          </Route>

          {/* Student routes */}
          <Route
            path="/student"
            element={
              <ProtectedRoute role="student">
                <Student_layout />
              </ProtectedRoute>
            }
          >
            <Route path="dashboard" element={<StudentDashboard />} />
            <Route path="course/:courseId/quiz/:quizId" element={<QuizAttempt />} />
          </Route>

        </Routes>
      </BrowserRouter>
      <ToastContainer />
    </>
  )
}
export default App
