import React, {useState} from "react";
import './Signup.css';
import { MdOutlineEmail } from "react-icons/md";
import { MdLock } from "react-icons/md";
import { FaRegUser } from "react-icons/fa6";
import {useNavigate} from 'react-router-dom';
import axios from "axios";

function Signup(){


    const api_url=process.env.REACT_APP_SIGNUP_URL;
    const navigate=useNavigate();
    const [name, setName]=useState('');
    const [email, setEmail]=useState('');
    const [password, setPassword]=useState('');

let handleSignup=()=>{

const userData={name, email, password};

if(name===''||email===''||password===''){
    alert('Please fill in all the fields');
}

axios.post(api_url, userData)
.then(response=> 
    {console.log('Data sent to the backend'); 
      navigate('/atmos')  
})
.catch(error=> console.log(`Could not send data to the backend due to error ${error}`));

}

    return (
        <>
        <div className="signup_main">
                    <div className="login_heading">Signup</div>
                    <div className="login_extra_row"><span id="user_logo"><FaRegUser/></span><span id="user_txt"><input type="textbox" id="user_txt" placeholder="Enter your name" onChange={(e)=>setName(e.target.value)}/></span></div>
                    <div className="login_first_row"><span id="email_logo"><MdOutlineEmail /></span><span id="email_txt"><input type="textbox" id="email_txt" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}/></span></div>
                    <div className="login_second_row"><span id="password_logo"><MdLock/></span><span id="pwd_txt"><input type="password" id="password_txt" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)}/></span></div>
                    <div className="login_btn"><button id="loginbtn" onClick={handleSignup}>Signup</button></div>
                    <div className="notsignedup">If you have already signedup then please <a href="http://localhost:3000/"><button id="signuplink">Login</button></a></div>
                </div>
        </>
    )
}

export default Signup;