import React, { Component } from "react";
import "./Labels.css";
import axios from "axios";
import { Link } from "react-router-dom";
import { SketchPicker } from "react-color";
export default class Labels extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DataLabelsValue: [],
      token: "",
      User: [],
      background: "#ffffff",
      backgroundColor: "#ffffff"
    };
  }
  componentDidMount() {
    this.Information_User();
  }

  Information_User = () => {
    const requestToken = localStorage.getItem("User_Token");
    console.log("Information_User", requestToken);
    axios({
      method: "Get",
      url: "https://api.github.com/user",
      headers: {
        Authorization: "token " + requestToken
      }
    })
      .then(res => {
        const dataUser = res.data;
        this.setState({ User: dataUser });
        this.Load_DataLabels();
      })
      .catch(err => {
        console.log("No return Information_User");
      });
  };
  Load_DataLabels = () => {
    axios({
      method: "GET",
      url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/labels`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.cloak-preview"
      }
    })
      .then(res => {
        const Load_DataLabels = res.data;
        this.setState({ DataLabelsValue: Load_DataLabels });
      })
      .catch(err => {
        console.log(err);
        console.log("No return Information_User");
      });

  };

  btnCreateLabels = () => {
    const CreateNameLabel = document.getElementById("CreateNameLabels").value;
    const CreateDescriptionLabel = document.getElementById(
      "CreateDescriptionLabels"
    ).value;
    const CreateColorLabel = this.state.backgroundColor;
    const CutString = CreateColorLabel.slice(1, 7);
    const TokenAdmin = localStorage.getItem("User_Token");
    console.log("One", CreateNameLabel, CreateDescriptionLabel, CutString);
    const payLoad = {
      name: CreateNameLabel,
      color: CutString,
      description: CreateDescriptionLabel
    };

    axios({
      method: "POST",
      url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/labels`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${TokenAdmin}`,
        Accept: "application/vnd.github.cloak-preview"
      },
      data: JSON.stringify(payLoad)
    }).then(res => {
      console.log("Hoang", res.data);
      this.readLoadPage();
    });
  };

  btnEditLabels = (name, description, color) => {
    const EditNameLabel = document.getElementById(
      "EditNameLabel" + name + color
    ).value;
    const EditDescriptionLabel = document.getElementById(
      "EditDescriptionLabel" + description + color
    ).value;
    const EditColorLabel = document.getElementById("EditColorLabel" + color)
      .innerHTML;
    const CutString = EditColorLabel.slice(1, 7);
    const TokenAdmin = localStorage.getItem("User_Token");
    const payLoad = {
      new_name: EditNameLabel,
      color: CutString,
      description: EditDescriptionLabel
    };

    axios({
      method: "PATCH",
      url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/labels/${name}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${TokenAdmin}`,
        Accept: "application/vnd.github.cloak-preview"
      },
      data: JSON.stringify(payLoad)
    }).then(res => {
      this.readLoadPage();
    });
  };
  btnDeleteLables = labels => {
    const TokenAdmin = localStorage.getItem("User_Token");
    axios({
      method: "DELETE",
      url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/labels/${labels}`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${TokenAdmin}`,
        Accept: "application/vnd.github.cloak-preview"
      }
    }).then(res => {
      this.readLoadPage();
    });
  };
  readLoadPage = () => {
    for (let i = 0; i < 4; i++) {
      console.log(i);
      this.Load_DataLabels();
      if (i === 1) {
        this.clearCheckBox();
      }
      console.log("Hoang", [i]);
      if (i === 2) {
        setTimeout(() => window.location.reload(true), 2000);
      }
    }
  };

  clearCheckBox = () => {
    console.log("clear");
    var aa = document.querySelectorAll("input[type=text]");
    for (var l = 0; l < aa.length; l++) {
      aa[l].value = "";
    }
  };
  handleChangeComplete = color => {
    this.setState({ background: color.hex });
  };
  handleChangeComplete1 = color => {
    this.setState({ backgroundColor: color.hex });
  };

  TableDataLabels = () => {
    const getDataLabel = this.state.DataLabelsValue;
    return getDataLabel.map((dataLabels, keyLabels) => {
      return (
        <tr key={keyLabels}>
          <td>
            <span
              className="rounded"
              style={{ background: "#" + dataLabels.color, padding: "8px" }}
            >
              {dataLabels.name}
            </span>
          </td>
          <td>{dataLabels.description}</td>
          <td>{dataLabels.color}</td>
          <td>
            <button
              type="button"
              className="btn btn-secondary btn-sm mr-1 mb-1"
              data-toggle="modal"
              data-target={`#` + "edit" + dataLabels.id}
            >
              Edit
            </button>
            <button
              type="button"
              className="btn btn-danger btn-sm "
              data-toggle="modal"
              data-target={`#` + "delete" + dataLabels.id}
            >
              Delete
            </button>
          </td>
          <td>
            <div
              className="modal fade"
              id={"edit" + dataLabels.id}
              tabIndex={-1}
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      Edit Lable
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <label className="font-weight-bold">Name</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      defaultValue={dataLabels.name}
                      id={"EditNameLabel" + dataLabels.name + dataLabels.color}
                    />
                    <label className="font-weight-bold">Descrioption</label>
                    <input
                      type="text"
                      className="form-control mb-2"
                      defaultValue={dataLabels.description}
                      id={
                        "EditDescriptionLabel" +
                        dataLabels.description +
                        dataLabels.color
                      }
                    />
                    <label className="font-weight-bold">Color</label>
                    <div className="d-flex  justify-content-center my-auto">
                      <div
                        className=""
                        style={{
                          width: "50px",
                          height: "50px",
                          background: this.state.background,
                          border: "1px solid black"
                        }}
                      ></div>
                      <div
                        className="mr-3"
                        style={{
                          width: "100px",
                          height: "50px"
                        }}
                      >
                        <p id={"EditColorLabel" + dataLabels.color}>
                          {this.state.background === "#ffffff"
                            ? dataLabels.color
                            : this.state.background}
                        </p>
                      </div>
                      <SketchPicker
                        color={
                          this.state.background === "#ffffff"
                            ? dataLabels.color
                            : this.state.background
                        }
                        onChangeComplete={this.handleChangeComplete}
                      />
                    </div>
                  </div>

                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary "
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      data-dismiss="modal"
                      type="button"
                      className="btn btn-primary"
                      onClick={() =>
                        this.btnEditLabels(
                          dataLabels.name,
                          dataLabels.description,
                          dataLabels.color
                        )
                      }
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
          <td>
            <div
              className="modal fade"
              id={"delete" + dataLabels.id}
              tabIndex={-1}
              role="dialog"
              aria-labelledby="exampleModalCenterTitle"
              aria-hidden="true"
            >
              <div
                className="modal-dialog modal-dialog-centered"
                role="document"
              >
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title" id="exampleModalLongTitle">
                      Delete Label
                    </h5>
                    <button
                      type="button"
                      className="close"
                      data-dismiss="modal"
                      aria-label="Close"
                    >
                      <span aria-hidden="true">×</span>
                    </button>
                  </div>
                  <div className="modal-body">
                    <p>Are You Sure</p>
                    <p className="font-weight-bold">{dataLabels.name}</p>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      data-dismiss="modal"
                    >
                      Close
                    </button>
                    <button
                      type="button"
                      className="btn btn-primary"
                      data-dismiss="modal"
                      onClick={() => this.btnDeleteLables(dataLabels.name)}
                    >
                      Save changes
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      );
    });
  };

  render() {
    return (
      <>
        <header>
          <nav className="navbar navbar-dark bg-white  navbar-expand-lg d-flex justify-content-around container-fluid">
            <div className=" col-xs-2 col-lg-3 ">
              <Link
                className="navbar-brand d-none d-sm-none d-md-none d-lg-block mx-auto"
                to=""
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
                to=""
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
            <div className="Menu-Onclick col-lg-6">
              <div className="collapse navbar-collapse" id="navbar-list-2">
                <ul className="navbar-nav list-inline d-flex ml-auto justify-content-center">
                  <li className="nav-item list-inline-item text-dark ">
                    <p>
                      <img
                        src={this.state.User.avatar_url}
                        width="40vw"
                        height="auto"
                        className="rounded-circle"
                      ></img>
                      {this.state.User.login}
                    </p>
                  </li>
                  <li className="nav-item-1 list-inline-item text-danger ">
                    <Link
                      type="button"
                      to="https://github.com/logout"
                      className="btn btn-outline-primary  "
                    >
                      Sing Out
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>
        </header>
        <div className="boxNone"></div>
        <div className="Banner d-flex align-items-center ">
          <div className="col-md-9 mx-lg-auto mx-md-auto Banner_Text">
            <p className="TextBanner_One">Looking for help or advice?</p>
            <p className="TextBanner_Two">
              Submit the support ticket to our Github channel and get support
              from our Technical team
            </p>
          </div>
        </div>

        <div className="container">
          <button
            type="button"
            className="btn btn-success  mr-1 mb-1"
            data-toggle="modal"
            data-target="#CreateLables"
          >
            Create Lable
          </button>

          <div
            className="modal fade"
            id="CreateLables"
            tabIndex={-1}
            role="dialog"
            aria-labelledby="exampleModalCenterTitle"
            aria-hidden="true"
          >
            <div className="modal-dialog modal-dialog-centered" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title" id="exampleModalLongTitle">
                    Create Lable
                  </h5>
                  <button
                    type="button"
                    className="close"
                    data-dismiss="modal"
                    aria-label="Close"
                  >
                    <span aria-hidden="true">×</span>
                  </button>
                </div>
                <div className="modal-body">
                  <div className="col-10 m-auto">
                    <div className="form-group ">
                      <label className="font-weight-bold">Name Label</label>
                      <input
                        type="text"
                        id="CreateNameLabels"
                        className="form-control"
                        aria-describedby="emailHelp"
                        placeholder="Enter Title"
                      />
                    </div>
                    <div className="form-group">
                      <label className="font-weight-bold">Description</label>
                      <div className="form-group" id="editor">
                        <textarea
                          rows="5"
                          className="form-control"
                          id="CreateDescriptionLabels"
                        />
                      </div>
                      <div className="form-group">
                        <label className="font-weight-bold">Color</label>
                        <div className="d-flex  justify-content-center my-auto">
                          <div
                            className=""
                            style={{
                              width: "50px",
                              height: "50px",
                              background: this.state.backgroundColor,
                              border: "1px solid black"
                            }}
                          ></div>
                          <div
                            className="mr-3"
                            style={{
                              width: "100px",
                              height: "50px"
                            }}
                          >
                            <p id="CreateColorLabels">
                              {this.state.backgroundColor}
                            </p>
                          </div>
                          <SketchPicker
                            color={this.state.backgroundColor}
                            onChangeComplete={this.handleChangeComplete1}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-secondary "
                    data-dismiss="modal"
                  >
                    Close
                  </button>
                  <button
                    data-dismiss="modal"
                    type="button"
                    className="btn btn-primary"
                    onClick={this.btnCreateLabels}
                  >
                    Save changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <section>
          <div className="table-responsive">
            <table className="table table-striped table-inverse col-10 m-auto">
              <thead className="">
                <tr>
                  <th>Name</th>
                  <th>Description</th>
                  <th>Color</th>
                  <th>Edit Delete</th>
                </tr>
              </thead>
              <tbody className="LoadPages">{this.TableDataLabels()}</tbody>
            </table>
          </div>
        </section>

        <div className="container Footer">
          <div className="d-flex justify-content-between  align-items-center Footer_Box">
            <ul className="d-flex list-inline   align-items-center">
              <li>
                <Link to="" className="Size_img">
                  <img src="http://inspireui.com/wp-content/uploads/2018/11/inspireui-icon.png" />
                </Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="#">Dosc Hone</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="#">Services</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="#">Services</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="#">Youtube</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="#">Twitter</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="#">Facebook</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="#">About Us</Link>
              </li>
            </ul>
            <ul className="d-flex list-inline ">
              <li>
                <Link to="#">docs.inspireui.com</Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}
