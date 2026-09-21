
import { Link } from "react-router-dom"
function Footer(){
    return(
        <>
  <div
    className="container-fluid text-light footer pt-5 mt-5"
    style={{ backgroundColor: "#0b5cfe" }}
  >
    <div className="container py-5">
      <div className="row g-5">
        <div className="col-lg-3 col-md-6">
          <h4 className="text-white mb-3">Quick Link</h4>
          <Link className="btn btn-link" to="/about">About Us</Link>
          <Link className="btn btn-link" to="/contact">Contact Us</Link>
          <Link className="btn btn-link" to="/">Privacy Policy</Link>
          <Link className="btn btn-link" to="/">Terms &amp; Condition</Link>
          <Link className="btn btn-link" to="/">FAQs &amp; Help</Link>
        </div>
        <div className="col-lg-3 col-md-6">
          <h4 className="text-white mb-3">Contact</h4>
          <p className="mb-2">
            <i className="fa fa-map-marker-alt me-3" />
            123 Street, New York, USA
          </p>
          <p className="mb-2">
            <i className="fa fa-phone-alt me-3" />
            +012 345 67890
          </p>
          <p className="mb-2">
            <i className="fa fa-envelope me-3" />
            info@example.com
          </p>
          <div className="d-flex pt-2">
            <Link className="btn btn-outline-light btn-social" to="/">
              <i className="fab fa-twitter" />
            </Link>
            <Link className="btn btn-outline-light btn-social" to="/">
              <i className="fab fa-facebook-f" />
            </Link>
            <Link className="btn btn-outline-light btn-social" to="/">
              <i className="fab fa-youtube" />
            </Link>
            <Link className="btn btn-outline-light btn-social" to="/">
              <i className="fab fa-linkedin-in" />
            </Link>
          </div>
        </div>
        <div className="col-lg-3 col-md-6">
          <h4 className="text-white mb-3">Gallery</h4>
        </div>
        <div className="col-lg-3 col-md-6">
          <h4 className="text-white mb-3">Newsletter</h4>
          <p>Get updates on new courses as they launch.</p>
          <div className="position-relative mx-auto" style={{ maxWidth: 400 }}>
            <input
              className="form-control border-0 w-100 py-3 ps-4 pe-5"
              type="text"
              placeholder="Your email"
            />
            <button
              type="button"
              className="btn py-2 position-absolute top-0 end-0 mt-2 me-2"
              style={{ backgroundColor: "#ffffff", color: "#1066e7", border: "none" }}
            >
              SignUp
            </button>
          </div>
        </div>
      </div>
    </div>
    <div className="container">
      <div className="copyright" style={{ borderTop: "1px solid rgba(255,255,255,0.15)", paddingTop: 16 }}>
        <div className="row">
          <div className="col-md-6 text-center text-md-start mb-3 mb-md-0">
            © LearningGaints, All Rights Reserved.
          </div>
          <div className="col-md-6 text-center text-md-end">
            <div className="footer-menu">
              <Link to="/">Home</Link>
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
        </>
    )
}
export default Footer
