import { Link } from "react-router-dom"
import "./About.css"

const FEATURES = [
  { icon: "fa-book", title: "Structured Courses", text: "Courses are broken into topics, each with a focused quiz." },
  { icon: "fa-tasks", title: "Topic-wise Quizzes", text: "Test your understanding one topic at a time, not all at once." },
  { icon: "fa-chart-line", title: "Progress Tracking", text: "See exactly how far you are through every course you join." },
  { icon: "fa-award", title: "Certificates", text: "Earn a certificate once you finish a course's quizzes." },
  { icon: "fa-laptop-code", title: "Practical Learning", text: "Built around hands-on skills, not just theory." },
  { icon: "fa-chart-bar", title: "Performance Analytics", text: "Track scores and completion from your dashboard." },
]

function About(){
    return(
        <>
  <div className="container-xxl py-5">
    <div className="container">
      <div className="row g-5 align-items-center">
        <div className="col-lg-6" style={{ minHeight: 360 }}>
          <div className="position-relative h-100">
            <img
              className="img-fluid position-absolute w-100 h-100"
              src="/images/about.svg"
              alt="LearningGaints platform illustration"
              style={{ objectFit: "cover", borderRadius: 16 }}
            />
          </div>
        </div>
        <div className="col-lg-6">
          <h6 className="section-title bg-white text-start text-primary pe-3">
            About Us
          </h6>
          <h1 className="mb-4">Welcome to LearningGaints</h1>
          <p className="mb-4">
            LearningGaints is a role-based learning platform. Admins build multi-topic
            courses with a quiz for every topic; students enroll, work through each
            topic, and track their progress toward a certificate — all from one dashboard.
          </p>
          <div className="row gy-2 gx-4 mb-4">
            <div className="col-sm-6">
              <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2" />Multiple Courses</p>
            </div>
            <div className="col-sm-6">
              <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2" />Topic-wise Quizzes</p>
            </div>
            <div className="col-sm-6">
              <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2" />Completion Certificate</p>
            </div>
            <div className="col-sm-6">
              <p className="mb-0"><i className="fa fa-arrow-right text-primary me-2" />Self-Paced Learning</p>
            </div>
          </div>
          <Link className="btn btn-primary py-3 px-5 mt-2" to="/courses">
            Browse Courses
          </Link>
        </div>
      </div>
    </div>
  </div>

  <div className="container-xxl py-5 about-features-section">
    <div className="container">
      <div className="text-center mb-5">
        <h6 className="section-title bg-white text-center text-primary px-3">Why Choose Us</h6>
        <h1 className="mb-0">Everything you need to actually learn</h1>
      </div>
      <div className="row g-4">
        {FEATURES.map((f) => (
          <div className="col-md-6 col-lg-4" key={f.title}>
            <div className="about-feature-card">
              <div className="about-feature-icon"><i className={`fa ${f.icon}`} /></div>
              <h5 className="mb-2">{f.title}</h5>
              <p className="text-muted mb-0">{f.text}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
        </>
    )
}
export default About
