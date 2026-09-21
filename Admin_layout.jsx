import { Outlet } from "react-router-dom"
import Header from "./pages/Header"
import Footer from "./pages/Footer"

function Admin_layout(){
    return(
        <>
        <Header/>
        <Outlet/>
        <Footer/>
        </>
    )
}
export default Admin_layout
