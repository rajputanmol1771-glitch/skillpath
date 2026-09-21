import { useEffect, useState } from "react"
import CourseServices from "../../../services/CourseServices"
import CourseCard from "../../shared/CourseCard"

function Courses(){
    const [courses, setCourses] = useState([])
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        (async () => {
            const data = await CourseServices.Active()
            setCourses(data)
            setLoading(false)
        })()
    }, [])

    const filtered = courses.filter((c) =>
        c.title?.toLowerCase().includes(search.toLowerCase()) ||
        c.subject?.toLowerCase().includes(search.toLowerCase())
    )

    return(
        <>
        <div className="container-xxl py-5">
            <div className="container">
                <div className="text-center">
                    <h6 className="section-title bg-white text-center text-primary px-3">
                        Courses
                    </h6>
                    <h1 className="mb-4">Popular Courses</h1>
                </div>

                <div className="d-flex justify-content-center mb-5">
                    <input
                        type="text"
                        className="form-control"
                        style={{ maxWidth: 360 }}
                        placeholder="Search courses by title or subject..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>

                {!loading && filtered.length === 0 && (
                    <div className="text-center text-muted py-5">
                        <i className="fa fa-book mb-3" style={{ fontSize: "2rem", display: "block" }} />
                        No courses available right now. Please check back soon.
                    </div>
                )}

                <div className="row g-4 justify-content-center">
                    {filtered.map((course) => (
                        <CourseCard key={course.id} course={course} />
                    ))}
                </div>
            </div>
        </div>
        </>
    )
}
export default Courses
