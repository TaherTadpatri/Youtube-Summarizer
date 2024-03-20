import React, { useState } from "react";
import { useNavigate } from "react-router";

function Login() {
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
    const [username,setusername]=useState()
    const [password,setpassword]=useState()
    const [erroMsg, setErrorMessage] = useState() 
    const [loading,setloading]=useState(false)
    const navigate=useNavigate()
    
    const handleSubmit = async (e) => { 
      e.preventDefault();
      try{
        setloading(true)
        const response= await fetch('http://127.0.0.1:8000/login/',{ 
            method : "POST",
            headers : { 
                "content-Type" :  "application/json",
            },
            body : JSON.stringify({ username , password })
            });
          if(response.ok){ 
            console.log("login sucessfull");
            localStorage.setItem('user', username);
            setErrorMessage("");
            navigate('/link')    
          }else{ 
            setErrorMessage('invalid username or password')
          }
       } catch(error){ 
           setErrorMessage("Error occured while login")
       }finally {
        setloading(false);
    }
    };

    

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label for="exampleInputEmail1" className="form-label">
            Username
          </label>
          <input
            type="text"
            className="form-control"
            id="exampleInputEmail1"
            aria-describedby="emailHelp"
            name="username"
            value={username}
            onChange={(e) => setusername(e.target.value)}
          />
        </div>
        <div className="mb-3">
          <label for="exampleInputPassword1" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="exampleInputPassword1"
            name="password"
            value={password}
            onChange={(e) => setpassword(e.target.value)}
          />
          {erroMsg && <div className="text-danger">{erroMsg}</div>}
        </div>
        <button type="submit" style={ButtonStyle}>
           {loading ? "Logging in..." : "Login"}
        </button>
      </form>
      
    </>
  );
}

export default Login;
