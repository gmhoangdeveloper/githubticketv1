import React, { Component } from "react";
import "./Github.css";
import { Link } from 'react-router-dom';
export default class github extends Component {
  render() {
    return (
      <div>
      <header className="" >
          <nav
            className="navbar navbar-dark bg-white  navbar-expand-lg d-flex justify-content-around container-fluid"
          >
            <div
              className=" col-xs-2 col-lg-3 "

            >
              <Link
                className="navbar-brand d-none d-sm-none d-md-none d-lg-block mx-auto"
                to="index.html"
              >
                <img
                  src="http://inspireui.com/wp-content/uploads/2018/11/inspireui-icon.png"
                  id="LogoMENU"
                  alt="logo"
                  width="120vw"
                  height="auto"
                />
              </Link>
              <Link
                className="navbar-brand d-xs-block d-md-block d-lg-none"
                to="index.html"
              >
                <img
                  src="http://inspireui.com/wp-content/uploads/2018/11/inspireui-icon.png"
                  alt="logo"
                  width="90vw"
                  height="auto"
                />
              </Link>
              <div className="float-right Icon_bars">
                <button
                  className="navbar-toggler btn-md"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbar-list-2"
                  aria-controls="navbarNav"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <i className="fa fa-bars" aria-hidden="true" />
                </button>
              </div>
            </div>
            <div
              className="Menu-Onclick col-lg-6"

            >
             
            </div>
        
          </nav>
        </header>
        <div className="boxNone"></div>
        <div className="Banner d-flex align-items-center ">
          <div className="col-md-9 mx-lg-auto mx-md-auto Banner_Text">
            <p className="TextBanner_One">Looking for help or advice?</p>
            <p className="TextBanner_Two">Submit the support ticket to our Github channel and get support from our Technical
      team</p>
          </div>
        </div>
     <div className="Button_Github">
        <a
          className="button button--social-login button--github"
          href="https://github.com/login/oauth/authorize?client_id=818ff1c194ee03e69dfb&scope=user%20repo"
        >
          <i className="icon fa fa-github" />
          Login With Github
        </a>
        </div>
        <div className="container Footer">
          <div className="d-flex justify-content-between  align-items-center Footer_Box">
            <ul className="d-flex list-inline   align-items-center">
              <li><Link className="Size_img"> <img src="http://inspireui.com/wp-content/uploads/2018/11/inspireui-icon.png" /></Link></li>
              <li className="d-none d-lg-block"> <Link to="">Dosc Hone</Link></li>
              <li className="d-none d-lg-block"> <Link to="">Services</Link></li>
              <li className="d-none d-lg-block"> <Link to="">Services</Link></li>
              <li className="d-none d-lg-block"> <Link to="">Youtube</Link></li>
              <li className="d-none d-lg-block"> <Link to="">Twitter</Link></li>
              <li className="d-none d-lg-block"> <Link to="">Facebook</Link></li>
              <li className="d-none d-lg-block"> <Link to="">About Us</Link></li>
            </ul>
            <ul className="d-flex list-inline ">
              <li> <Link to>docs.inspireui.com</Link></li>
            </ul>
          </div>
        </div>

      </div>
    );
  }
}
