import React, { useState } from "react";
import Login from "./Login";
import SignUp from "./SignUp";
import { TypeAnimation } from "react-type-animation";

function Home() {
  const LeftContainerStyle = {
    backgroundColor: "#f0a259",
    height: "100vh",
    display: "flex",
    "justify-content": "left",
    "align-items": "center",
    color: "white",
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
  const RightContainerStyle = {
    backgroundColor: "white",
    height: "100vh",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  };
  const FormContainerStyle = {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  };
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);

  const handleLoginButtonClick = () => {
    setShowLogin(true);
    setShowSignup(false);
  };

  const handleSignupButtonClick = () => {
    setShowLogin(false);
    setShowSignup(true);
  };
  return (
    <>
      <div className="container-flex">
        <div className="row">
          <div className="col-8 ps-3 " style={LeftContainerStyle}>
            <br></br>
            <TypeAnimation
              sequence={[
                "Share link and ready to go",
                1000,
                "https://www.youtube.com/watch?v=fX64q6sYom0",
                { deleteAll: true },
                "Analyzing the video transcript...",
                3000,
                "The summary of the video is: for loops you can execute a block of code a fixed number of times you can iterate over a range a string a sequence anything that is considered iterable there is a lot of overlap where you could use either a while loop or a for Loop . loops tend to be better if you need to execute something possibly infinite amount of times such as when youre accepting user input for example.",
                1000,
              ]}
              wrapper="span"
              speed={50}
              style={{
                color: "white",
                fontSize: "2em",
                display: "inline-block",
                marginBlockStart: "5px",
              }}
              repeat={Infinity}
            />
          </div>
          <div
            className="col-4 d-flex align-items-center"
            style={RightContainerStyle}
          >
            <div className="card ps-3 pt-3 pe-3 pb-3">
              <div
                className="container d-flex align-items-center  "
                style={FormContainerStyle}
              >
                <button style={ButtonStyle} onClick={handleLoginButtonClick}>
                  Log in
                </button>
                <button style={ButtonStyle} onClick={handleSignupButtonClick}>
                  Signup
                </button>
              </div>

              {showLogin ? <Login /> : <SignUp />}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
