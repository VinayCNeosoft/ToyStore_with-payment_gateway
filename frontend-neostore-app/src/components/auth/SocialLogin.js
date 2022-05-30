import React,{useState} from 'react'
//import PaginationEx from './PaginationEx';
import SocialButton from '../auth/SocialButton';
import { useNavigate } from "react-router-dom";
import { loginUser,registerSocialUser,registerUser } from '../../config/NodeService';
import {FaFacebookF,FaGoogle} from 'react-icons/fa'
import { toast } from 'react-toastify';
import jwt_decode from 'jwt-decode'



function SocialLogin() {
    const [data,setUserData] = useState()
    const [user,setUser] = useState({fname:'',lname:'',email:'',mobile:'',gender:'',image:'',dob:''})
    const navigate = useNavigate();
    const [uid,setUid] = useState(null)


    const handleSocialLogin = (user) => {
        console.log(user);
        setUserData({...user,email:user._profile.email,fname:user._profile.firstName,lname:user._profile.lastName,image:user._profile.profilePicURL})
        console.log(user._profile)
        console.log(user)
        registerSocialUser(user._profile)
        .then(res=>{
            if (res.data.success === true) {
                console.log(res.data)
                console.log(res.data.user)
                localStorage.setItem("user",JSON.stringify({fname:res.data.user.fname,lname:res.data.user.lname,email:res.data.user.email,mobile:res.data.user.mobile,gender:res.data.user.gender,image:res.data.user.logo}))
                localStorage.setItem("token",res.data.token);
                localStorage.setItem("email",res.data.user.email);
                localStorage.setItem("status","isLogged")
                let token=localStorage.getItem('token');
                let decode=jwt_decode(token);
                console.log(decode)
                setUid(decode)
                toast(`${res.data.message}`);
                navigate("/")
            }
            else if (res.data.success === false) {
              console.log(res.data);
              toast(`${res.data.message}`)
            }
        })
    };
    const handleSocialLoginFailure = (err) => {
        console.error(err);
        navigate("/")
    };
    return (
        <div className='container text-center'>
            <SocialButton
                className="btn btn-info social-btn"
                provider='facebook'
                appId='611490336816637'
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}
                // onLogoutSuccess={this.onLogoutSuccess}
                key={'facebook'}
                onInternetFailure = {handleSocialLoginFailure}
                >
                <FaFacebookF/>
            </SocialButton>

            <SocialButton className="btn btn-warning social-btn"
                provider="google"
                appId="1028422348134-hr5b89lt5q7h2d2155qs2uq8eugrumu3.apps.googleusercontent.com"
                onLoginSuccess={handleSocialLogin}
                onLoginFailure={handleSocialLoginFailure}
                >
                <FaGoogle/>
            </SocialButton>
        </div>
    )
}

export default SocialLogin