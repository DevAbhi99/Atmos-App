import React, {useState} from "react";
import './Login.css';
import { MdOutlineEmail } from "react-icons/md";
import { MdLock } from "react-icons/md";
import {useNavigate} from 'react-router-dom';
import axios from "axios";

function Login(){

    const api_url=process.env.REACT_APP_LOGIN_URL;
        const navigate=useNavigate();
            const [email, setEmail]=useState('');
            const [password, setPassword]=useState('');

            let handleLogin=()=>{

                const userData={email, password};

                if(email===''||password===''){
                    alert('Please fill all the fields!');
                }

                axios.post(api_url, userData)
                .then(response=>{
                    if(response.status===200){
                        navigate('/atmos');
                    }
                })
                .catch(error=>console.log(`Could not login due to error ${error}`));

            }

    return (
        <>
        <div className="login_main">
            <div className="login_heading">Login</div>
            <div className="login_first_row"><span id="email_logo"><MdOutlineEmail /></span><span id="email_txt"><input type="textbox" id="email_txt" placeholder="Enter your email" onChange={(e)=>setEmail(e.target.value)}/></span></div>
            <div className="login_second_row"><span id="password_logo"><MdLock/></span><span id="pwd_txt"><input type="password" id="password_txt" placeholder="Enter your password" onChange={(e)=>setPassword(e.target.value)}/></span></div>
            <div className="login_btn"><button id="loginbtn" onClick={handleLogin}>Login</button></div>
            <div className="notsignedup">If you have not signed up then please <a href="http://localhost:3000/signup"><button id="signuplink" >Signup</button></a></div>
        </div>
        </>
    )
}


export default Login;