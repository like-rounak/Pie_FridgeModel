import React from "react";

export const Header = (props) => {
  return (
    <header id="header">
      <div className="intro">
        <div className="overlay">
          <div className="container">
            <div className="row">
              <div className="col-md-8 col-md-offset-2 intro-text">
                <h1>
                  {props.data ? props.data.title : "Loading"}
                  <span></span>
                </h1>
                <p>{props.data ? props.data.paragraph : "Loading"}</p>
                <a
                  href="/UploadForm"
                  className="btn btn-modern btn-lg page-scroll"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "10px 20px",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#fff",
                    backgroundColor: "#007BFF",
                    border: "2px solid #007BFF",
                    borderRadius: "30px",
                    textDecoration: "none",
                    transition: "all 0.3s ease-in-out",
                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                    position: "relative",
                    overflow: "hidden",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = "#0056b3";
                    e.target.style.color = "#fff";
                    e.target.style.boxShadow = "0 6px 8px rgba(0, 0, 0, 0.2)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = "#007BFF";
                    e.target.style.color = "#fff";
                    e.target.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.1)";
                  }}
                >
                  <span style={{ marginRight: "10px" }}>✨</span> Try Our AI Now
                </a>{" "}
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
