// components/Student_layout.jsx
import { Outlet } from "react-router-dom"
import Header from "./admin/pages/Header"
import Footer from "./admin/pages/Footer"

function Student_layout(){
    return(
        <>
        <Header/>
        <Outlet/>
        <Footer/>
        </>
    )
}
export default Student_layout
