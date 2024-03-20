import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import LearningContent from "./LearnCmp";

function LinkVideo() {
  const NavbarStyle = {
    backgroundColor: "#cef2d8",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 50px",
  };
  const ButtonStyle = {
    marginBottom: "10px",
    marginRight: "5px",
    padding: "10px 20px",
    border: "none",
    borderRadius: "5px",
    backgroundColor: "#fc8c03",
    color: "white",
    cursor: "pointer",
  };
  const [videoLink, setVideoLinks] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const userName = localStorage.getItem("user");
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/");
  };
  const handleSubmit = () => {
    const videoLinkString = JSON.stringify(videoLink);
    localStorage.setItem("Link", videoLinkString);
    navigate("/mainPage", { state: { videoLinks: { videoLink } } });
  };
  return (
    <>
      <div className="container">
        <div className="navbar" style={{ NavbarStyle }}>
          <div className="navbar-left">
            <h3>Username : {userName}</h3>
          </div>
          <div className="navbar-right">
            <button style={ButtonStyle} onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>

      <div
        className="contianer"
        style={{ padding: "0 250px", backgroundColor: "antiquewhite" }}
      >
        <div className="row">
          <div className="col-12">
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "40vh",
              }}
            >
              <div
                style={{ display: "flex", alignItems: "center", width: "100%" }}
              >
                <input
                  type="text"
                  placeholder="paste your link here..."
                  style={{
                    width: "100%",
                    padding: "10px",
                    borderRadius: "5px 0 0 5px",
                    border: "1px solid #ccc",
                  }}
                  onChange={(e) => setVideoLinks(e.target.value)}
                />

                <button
                  type="button"
                  style={{
                    padding: "10px 20px",
                    backgroundColor: "#007bff",
                    color: "white",
                    border: "none",
                    borderRadius: "0 5px 5px 0",
                  }}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mt-3 mb-5 ">
            <div className="card" style={{ backgroundColor: "cornsilk" }}>
              <div class="card-body">
                <LearningContent />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default LinkVideo;
