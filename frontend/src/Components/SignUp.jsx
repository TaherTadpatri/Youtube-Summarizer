import React, { useState } from "react";
import { useNavigate } from "react-router";

function SignUp() {
    const ButtonStyle = {
        "marginBottom": "10px",
        "marginRight":"5px",
        "padding": "10px 20px",
        "border": "none",
        "borderRadius": "5px",
        "backgroundColor": "#fc8c03",
        "color": "white",
        "cursor": "pointer"
    }
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [errorMsg, setErrorMessage] = useState("");
    const [loading,setloading]=useState()
    const navigate=useNavigate()

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('http://127.0.0.1:8000/register/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username,
                    password,
                    email,
                    first_name: firstName, 
                    last_name: lastName,   
                }),
            });

            if (response.ok) {
                console.log("Registration successful");
                navigate('/link')
                
            } else {
                const data = await response.json();
                setErrorMessage(data.error || "Failed to register");
            }
        } catch (error) {
            console.error("Error occurred while registering:", error);
            setErrorMessage("Error occurred while registering");
        }finally{ 
            setloading(true)
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3">
                    <label htmlFor="exampleInputUsername1" className="form-label">
                        Username
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputUsername1"
                        aria-describedby="usernameHelp"
                        name="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    <div id="usernameHelp" className="form-text">
                        Please enter your username.
                    </div>
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputEmail1" className="form-label">
                        Email address
                    </label>
                    <input
                        type="email"
                        className="form-control"
                        id="exampleInputEmail1"
                        aria-describedby="emailHelp"
                        name="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputPassword1" className="form-label">
                        Password
                    </label>
                    <input
                        type="password"
                        className="form-control"
                        id="exampleInputPassword1"
                        name="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputFirstName" className="form-label">
                        First Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputFirstName"
                        name="first-name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="exampleInputLastName" className="form-label">
                        Last Name
                    </label>
                    <input
                        type="text"
                        className="form-control"
                        id="exampleInputLastName"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </div>
                {errorMsg && <div className="text-danger">{errorMsg}</div>}
                <button type="submit" style={ButtonStyle}>
                    { loading ?  "Signing up .." : "Signup"}
                </button>
            </form>
        </>
    );
}

export default SignUp;
