import { Link } from "react-router-dom"

function Home(){
    return(
        <>
            <div className="container-xxl py-5">
                <div className="container">
                    <div className="row align-items-center g-5">
                        <div className="col-lg-6">
                            <h6 className="section-title bg-white text-start text-primary pe-3">
                                Skillpath
                            </h6>
                            <h1 className="mb-4">Learn a new skill, at your own pace</h1>
                            <p className="mb-4">
                                Browse hands-on courses built by our team, work through each
                                lesson, and test what you've learned with a quiz at the end.
                            </p>
                            <div className="d-flex gap-3">
                                <Link className="btn btn-primary py-3 px-5" to="/courses">
                                    Browse Courses
                                </Link>
                                <Link className="btn btn-outline-primary py-3 px-5" to="/about">
                                    Learn More
                                </Link>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <img
                                className="img-fluid rounded"
                                src="/images/about.svg"
                                alt="Students learning"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div className="container-xxl py-5">
                <div className="container">
                    <div className="text-center">
                        <h6 className="section-title bg-white text-center text-primary px-3">
                            Why LearningGaints
                        </h6>
                        <h1 className="mb-5">What you get</h1>
                    </div>
                    <div className="row g-4 text-center">
                        <div className="col-md-4">
                            <i className="fa fa-book text-primary mb-3" style={{ fontSize: "2rem" }} />
                            <h5>Structured Courses</h5>
                            <p className="text-muted">Clear, self-paced lessons for every skill level.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="fa fa-question-circle text-primary mb-3" style={{ fontSize: "2rem" }} />
                            <h5>Quizzes</h5>
                            <p className="text-muted">Check your understanding as you go.</p>
                        </div>
                        <div className="col-md-4">
                            <i className="fa fa-user-graduate text-primary mb-3" style={{ fontSize: "2rem" }} />
                            <h5>Track Progress</h5>
                            <p className="text-muted">See what you've finished from your dashboard.</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Home
