import React, { Component } from "react";
import "./Issues.css";
import axios from "axios";
import { Link } from "react-router-dom";
import CKEditor from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

export default class Issues extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      User: [],
      ckeditor: "",
      disabled: true,
      display: "d-none",
      purchasecode_display: "d-none",
      purchasecode_display2: "d-block",
      DataLabelsValue: [],
      InformationProduct: [],
      NameProjectPurchaseCode: "",
    };
  }
  componentDidMount() {
    this.AccessToken(this.Information_User);
    this.Load_DataLabels();
    this.AutoCheckPurchasecode();
  }
  // Check value title
  isDisabled = (e) => {
    var checkbox = document.querySelectorAll("input[name=labelNameCheckbox]");

    console.log("isDisabled", checkbox.checked === false);
    if (e.target.value.length >= 1) {
      this.setState({ disabled: false });
    } else {
      this.setState({
        disabled: true,
      });
    }
  };
  //Get Code Search
  getTheCode = () => {
    let requestToken = this.props.location.search;
    let token = requestToken.split("").splice(6).join("");
    return token;
  };
  //Get Token
  AccessToken = (Information_User) => {
    const clientID = "818ff1c194ee03e69dfb";
    const clientSecret = "cb2a8cdec0c1c51bdd01ab8776f9ea6f8c37605a";
    const requestToken = this.getTheCode();
    axios({
      method: "POST",
      url: `https://cors-anywhere.herokuapp.com/https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
      headers: {
        accept: "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    })
      .then((res) => {
        const accessToken = res.data.access_token;
        if (accessToken !== undefined) {
          localStorage.setItem("User_Token", accessToken);
        }
        Information_User(this.Load_Information_User);
      })
      .catch((err) => {
        console.log("No return AccessToken");
        setTimeout(() => this.AccessToken(), 1000);
      });
  };
  //Get Infomation User Account
  Information_User = (Load_Information_User) => {
    const requestToken = localStorage.getItem("User_Token");
    // console.log("Information_User", requestToken);
    axios({
      method: "Get",
      url: "https://api.github.com/user",
      headers: {
        Authorization: "token " + requestToken,
      },
    })
      .then((res) => {
        const dataUser = res.data;
        this.setState({ User: dataUser });
        Load_Information_User();
        this.Collaborators();
        // console.log("res Information ", res.data);
      })
      .catch((err) => {
        console.log("No return Information_User");
      });
  };
  //Load User Issues Project
  Load_Information_User = () => {
    const username = this.state.User.login;
    const Project_Repository = "gmhoangdeveloper/coffeeapi";
    axios({
      method: "GET",
      Accept: "application/vnd.github.cloak-preview",
      url: `https://api.github.com/search/issues?q=author:${username}+repo:${Project_Repository}+type:issue&per_page=100page=1`,
    })
      .then((res) => {
        this.setState({ data: res.data.items });
      })
      .catch((err) => {
        setTimeout(() => this.Load_Information_User(), 300);
        console.log("No Return Load_Information_User");
      });
  };
  //Function Auto check Value Purchasecode localStorage
  AutoCheckPurchasecode = () => {
    const localStoragePurchasecode = localStorage.getItem("Purchasecode");
    // console.log("localStoragePurchasecode", localStoragePurchasecode);
    if (
      localStoragePurchasecode === null ||
      localStoragePurchasecode === undefined ||
      localStoragePurchasecode === ""
    ) {
      this.checkPurchasecode();
    } else {
      this.setState({
        purchasecode_display: "d-block",
        purchasecode_display2: "d-none",
      });
      this.checkPurchasecode();
    }
  };
  //Hàm kiểm tra mã Show Form
  checkPurchasecode = () => {
    const Purchasecode = document.getElementById("Purchasecode").value;
    const code = Purchasecode;
    const localStoragePurchasecode = localStorage.getItem("Purchasecode");
    if (
      localStoragePurchasecode === null ||
      localStoragePurchasecode === undefined ||
      localStoragePurchasecode === ""
    ) {
      axios({
        method: "GET",
        url: `https://api.envato.com/v3/market/author/sale?code=${code}`,
        headers: {
          Authorization: "Bearer ppA2XuQHB3WNg8Ro4QyLDx0KIjWpWLmA",
        },
      })
        .then((res) => {
          console.log("Data Check", res.data.item.name);
          this.setState({ NameProjectPurchaseCode: res.data.item.name });
          this.setState({
            purchasecode_display: "d-block",
            purchasecode_display2: "d-none",
            InformationProduct: res.data,
          });
          localStorage.setItem("Purchasecode", Purchasecode);
        })
        .catch((err) => {
          console.log("No return Envato check");
        });
    } else {
      console.log("checkPurchasecode else");
      axios({
        method: "GET",
        url: `https://api.envato.com/v3/market/author/sale?code=${localStoragePurchasecode}`,
        headers: {
          Authorization: "Bearer ppA2XuQHB3WNg8Ro4QyLDx0KIjWpWLmA",
        },
      })
        .then((res) => {
          //   console.log("Data Check", res.data.item.name);
          this.setState({ NameProjectPurchaseCode: res.data.item.name });
          this.setState({
            purchasecode_display: "d-block",
            purchasecode_display2: "d-none",
            InformationProduct: res.data,
          });
        })
        .catch((err) => {
          console.log("No return Envato check");
        });
    }
  };
  btnClearCodePurchase = () => {
    localStorage.removeItem("Purchasecode");
    window.location.reload(true);
  };
  //Load Data Labels
  Load_DataLabels = () => {
    axios({
      method: "GET",
      url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/labels`,
      headers: {
        "Content-Type": "application/json",
        Accept: "application/vnd.github.cloak-preview",
      },
    })
      .then((res) => {
        const Load_DataLabels = res.data;
        this.setState({ DataLabelsValue: Load_DataLabels });
      })
      .catch((err) => {
        console.log(err);
        console.log("No return Labels");
      });
  };

  //Function Create Issues
  btnCreateIssues = () => {
    const title = document.getElementById("title").value;
    const description_dataCKEditor = sessionStorage.getItem("dataCKEditor");
    const description = description_dataCKEditor || {} || "";
    const retrievedObject = localStorage.getItem("User_Token");
    const payLoad = {
      title: title,
      body: description,
    };
    axios({
      method: "POST",
      url: "https://api.github.com/repos/gmhoangdeveloper/coffeeapi/issues",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${retrievedObject}`,
        Accept: "application/vnd.github.cloak-preview",
      },
      data: JSON.stringify(payLoad),
    })
      .then((res) => {
        // console.log("STEP1");
        setTimeout(() => this.Hide_Information_User(), 2000);
      })
      .catch((err) => {
        console.log("Not return create");
      });
  };
  //Load Lại Table Khi Mới tạo issues
  Hide_Information_User = () => {
    const username = this.state.User.login;
    const Project_Repository = "gmhoangdeveloper/coffeeapi";
    axios({
      method: "GET",
      Accept: "application/vnd.github.cloak-preview",
      url: `https://api.github.com/search/issues?q=author:${username}+repo:${Project_Repository}+type:issue&per_page=100`,
    })
      .then((res) => {
        this.setState({ data: res.data.items });
        console.log("STEP2");
        this.Auto_addLabel_User();
        console.log("Hide Information_User", res.data.items);
      })
      .catch((err) => {
        // this.Hide_Information_User();
        console.log("No Return Hide_Array_User_Issues");
      });
  };
  //Từ Hide_Information_User ->  Auto_addLabel_User (cập nhập lại Table Lấy [0] Để add Issues Vô)
  Auto_addLabel_User = () => {
    const NumberData = this.state.data[0].number;
    const TokenAdmin = "ac849124915da47333cc1724dc7dc8487c137c5a";
    const ArrayLabelName = [];
    var checkboxes = document.querySelectorAll("input[name=labelName]:checked");
    for (var i = 0; i < checkboxes.length; i++) {
      ArrayLabelName.push(checkboxes[i].value);
    }
    const labels = ArrayLabelName;
    const payLoad = {
      labels: labels,
    };
    axios({
      method: "POST",
      url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/issues/${NumberData}/labels`,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${TokenAdmin}`,
        Accept: "application/vnd.github.cloak-preview",
      },
      data: JSON.stringify(payLoad),
    })
      .then((res) => {
        console.log("STEP3");
        // this.readLoadPage();
        // console.log("Auto Add Labels", res.data[0]);
        // setTimeout(() => this.Load_DataLabels(), 3000);
        // this.Load_DataLabels()
        this.readLoadPage();
      })
      .catch((err) => {
        console.log("Not return create");
      });
  };
  //Function Create Labels
  btnCreateLabels = () => {
    const TokenAdmin = "ac849124915da47333cc1724dc7dc8487c137c5a";
    const ArrayLabelName = [];
    var checkboxes = document.querySelectorAll("input[name=labelName]:checked");
    for (var i = 0; i < checkboxes.length; i++) {
      ArrayLabelName.push(checkboxes[i].value);
    }

    const labels = ArrayLabelName;
    const payLoad = {
      labels: labels,
    };

    var array = [];
    var checkboxes = document.querySelectorAll(".LabelBug:checked");
    for (var i = 0; i < checkboxes.length; i++) {
      array.push(checkboxes[i].value);
    }
    const loadDataTable = array.length - 1;
    for (let i = 0; i < array.length; i++) {
      axios({
        method: "POST",
        url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/issues/${array[i]}/labels`,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Token ${TokenAdmin}`,
          Accept: "application/vnd.github.cloak-preview",
        },
        data: JSON.stringify(payLoad),
      });

      if (i === loadDataTable) {
        this.readLoadPage();
      }
    }
  };
  //Function Delete Labels
  btnDeleteLables = () => {
    const TokenAdmin = "ac849124915da47333cc1724dc7dc8487c137c5a";
    const ArrayLabelName = [];
    var checkboxes = document.querySelectorAll("input[name=labelName]:checked");
    for (var i = 0; i < checkboxes.length; i++) {
      ArrayLabelName.push(checkboxes[i].value);
    }
    const labels = ArrayLabelName;
    var array = [];
    var checkboxes = document.querySelectorAll(".LabelBug:checked");
    for (var i = 0; i < checkboxes.length; i++) {
      array.push(checkboxes[i].value);
    }
    const loadDataTable = array.length - 1;
    for (let i = 0; i < array.length; i++) {
      for (let j = 0; j < labels.length; j++) {
        axios({
          method: "DELETE",
          url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/issues/${array[i]}/labels/${labels[j]}`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Token ${TokenAdmin}`,
            Accept: "application/vnd.github.cloak-preview",
          },
        });
      }
      if (i === loadDataTable) {
        this.readLoadPage();
      }
    }
  };
  //Read Load Page
  readLoadPage = () => {
    for (let i = 0; i < 4; i++) {
      this.Load_Information_User();
      console.log(i);
      if (i === 1) {
        console.log("Clear ", i);
        this.clearCheckBox();
      }
      if (i === 3) {
        setTimeout(() => window.location.reload(true), 1000);
      }
    }
  };
  clearCheckBox = () => {
    var aa = document.querySelectorAll("input[type=checkbox]");
    for (var l = 0; l < aa.length; l++) {
      aa[l].checked = false;
    }
  };
  //Kiểm tra Admin  Nếu admin  Show Button Create New Labels . Else Hide Button New Labels
  Collaborators = () => {
    const username = this.state.User.login;
    const retrievedObject = localStorage.getItem("User_Token");
    axios({
      method: "GET",
      url: `https://api.github.com/repos/gmhoangdeveloper/coffeeapi/collaborators/${username}`,
      headers: {
        Authorization: `Token ${retrievedObject}`,
      },
    })
      .then((res) => {
        this.setState({ display: "d-inline" });
        //       console.log("Collaborators", res);
      })
      .catch((err) => {
        console.log("Not return Collaborators");
      });
  };
  //Get Information Product Purchare Code
  getInformationProduct = () => {
    const Product = [this.state.InformationProduct.item];
    return Product.map((dtProduct, index) => {
      if (dtProduct !== undefined) {
        return (
          <div key={index}>
            <img
              src={dtProduct.previews.icon_with_video_preview.icon_url}
            ></img>
            <p>{dtProduct.name}</p>
            <button
              type="button"
              className="btn btn-info"
              onClick={this.btnClearCodePurchase}
            >
              Clear Code
            </button>
          </div>
        );
      }
    });
  };
  //Classify Labels PurchareCode
  getDataLabels = () => {
    const FluxstorePro = "Fluxstore Pro - Flutter E-commerce Full App";
    const FluxstoreWooCommerce =
      "Fluxstore WooCommerce - Flutter E-commerce Full App";
    const DataLabelsValue = this.state.DataLabelsValue;
    // console.log("Array Inster1", DataLabelsValue);
    return DataLabelsValue.map((dtDataLabelsValue, index) => {
      // console.log("getDataLabels", DataLabelsValue);
      if (
        FluxstorePro === this.state.NameProjectPurchaseCode &&
        (index === 0 || index === 1 || index === 2)
      ) {
        return (
          <label className="customcheck customcheckBug" key={index}>
            {dtDataLabelsValue.name}
            <input
              type="checkbox"
              value={dtDataLabelsValue.name}
              className="labelsCheckbox"
              name="labelName"
            />
            <span className="checkmark"></span>
          </label>
        );
      }
      if (
        FluxstoreWooCommerce === this.state.NameProjectPurchaseCode &&
        (index === 3 ||
          index === 4 ||
          index === 5 ||
          index === 6 ||
          index === 7)
      ) {
        return (
          <label className="customcheck customcheckBug" key={index}>
            {dtDataLabelsValue.name}
            <input
              type="checkbox"
              value={dtDataLabelsValue.name}
              className="labelsCheckbox"
              name="labelName"
            />
            <span className="checkmark"></span>
          </label>
        );
      }
    });
  };
  //Get Data Issues in Table
  getdataTable = () => {
    const getData = this.state.data;
    return getData.map((dtissues, index) => {
      return (
        <tr key={index}>
          <td>
            <input
              type="checkbox"
              value={dtissues.number}
              className="LabelBug"
            />
          </td>
          <td className="text-left">
            <span className="d-inline">
              <a className="Font_Title" href={dtissues.html_url}>
                {dtissues.title}
              </a>
              {dtissues.labels.map((dtllabels, keindex) => {
                return (
                  <Link
                    key={keindex}
                    to="#"
                    className={
                      (dtllabels.name, "mr-1 rounded text-decoration-none ")
                    }
                    style={{
                      background: "#" + dtllabels.color,
                      padding: "8px",
                      color: "black",
                    }}
                  >
                    {dtllabels.name}
                  </Link>
                );
              })}
            </span>
            <p className="d-block">
              #{dtissues.number} ago by {dtissues.user.login}
            </p>
          </td>

          <td>
            <i className="zmdi zmdi-comment-text mr-1"></i>
            {dtissues.comments}
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
                    <a
                      type="button"
                      href="https://github.com/logout"
                      className="btn btn-outline-primary  "
                    >
                      Sing Out
                    </a>
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

        {/* Envato */}
        <div class={("form-group ", this.state.purchasecode_display2)}>
          <div className="container">
            <label for="Purchasecode">Purchase code</label>
            <input
              type="text"
              class="form-control "
              id="Purchasecode"
              placeholder="Enter purchase code"
            />
            <button
              type="submit"
              class="btn btn-info"
              onClick={this.checkPurchasecode}
            >
              Submit
            </button>
          </div>
        </div>
        {this.getInformationProduct()}

        <section>
          <section
            class={
              ("btn btn-success fromSubmit", this.state.purchasecode_display)
            }
          >
            <div className="col-10 m-auto">
              <div className="form-group ">
                <label className="exampleInputEmail1">Title</label>
                <input
                  type="text"
                  id="title"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter Title"
                  required
                  onChange={this.isDisabled}
                />
              </div>
              <div className="form-group">
                <label className="exampleInputPassword1">Description</label>
                <div className="form-group" id="editor">
                  <CKEditor
                    editor={ClassicEditor}
                    onInit={(editor) => {
                      // You can store the "editor" and use when it is needed.
                    }}
                    config={{
                      cloudServices: {
                        tokenUrl:
                          "https://73143.cke-cs.com/token/dev/0f96c8e27f697d78d271f1555c4bf29c2ee9c01d16b7babbc212a2808715",
                        uploadUrl: "https://73143.cke-cs.com/easyimage/upload/",
                      },
                    }}
                    onChange={(event, editor) => {
                      const dataCKEditor = editor.getData();
                      // console.log( { event, editor, data } );
                      this.setState({ Ckeditor: dataCKEditor });

                      sessionStorage.setItem(
                        "dataCKEditor",
                        this.state.Ckeditor
                      );
                    }}
                    onBlur={(event, editor) => {
                      // console.log( 'Blur.', editor );
                    }}
                    onFocus={(event, editor) => {
                      // console.log( 'Focus.', editor );
                    }}
                  />
                </div>
                <div className="container">{this.getDataLabels()}</div>
              </div>
              <button
                id="start_button"
                className={"btn btn-danger" + " " + this.state.display}
              >
                <a
                  href="/labels"
                  style={{ "text-decoration": "none", color: "white" }}
                >
                  New Labels
                </a>
              </button>
              <button
                type="submit"
                onClick={this.btnCreateIssues}
                id="start_button"
                className="btn btn-primary ml-1"
                disabled={this.state.disabled}
              >
                Create Issue
              </button>
              <button
                onClick={this.btnCreateLabels}
                id="start_button"
                className="btn btn-warning ml-1 mr-1"
              >
                Add label
              </button>
              <button
                onClick={this.btnDeleteLables}
                id="start_button"
                className="btn btn-danger"
              >
                Delelte label
              </button>
            </div>
          </section>
          <div className="table-responsive">
            <table className="table table-striped table-inverse col-10 m-auto">
              <thead className="">
                <tr>
                  <th className="w-5 "></th>
                  <th className="w-93  text-left">Title - Labels</th>
                  <th className="w-2 ">Comments</th>
                </tr>
              </thead>
              <tbody className="LoadPages">{this.getdataTable()}</tbody>
            </table>
          </div>
        </section>

        <div className="container Footer">
          <div className="d-flex justify-content-between  align-items-center Footer_Box">
            <ul className="d-flex list-inline   align-items-center">
              <li>
                <Link className="Size_img">
                  <img src="http://inspireui.com/wp-content/uploads/2018/11/inspireui-icon.png" />
                </Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="">Dosc Hone</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="">Services</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="">Services</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="">Youtube</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="">Twitter</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="">Facebook</Link>
              </li>
              <li className="d-none d-lg-block">
                <Link to="">About Us</Link>
              </li>
            </ul>
            <ul className="d-flex list-inline ">
              <li>
                <Link to="">docs.inspireui.com</Link>
              </li>
            </ul>
          </div>
        </div>
      </>
    );
  }
}
