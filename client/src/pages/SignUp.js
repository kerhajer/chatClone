import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signingUp,signInWithGoogle } from '../Redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
import Link from '@mui/material/Link';

const SignUp= () => {


    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const [newUser, setNewUser] = useState({});
    const msg = useSelector(state => state.UserReducer.msg)
    const user = useSelector(state => state.UserReducer.user)
  
    const handleChange = (e) => {
  
      setNewUser({ ...newUser, [e.target.name]: e.target.value });
    };
  
    const registering =  async(e) => {
      e.preventDefault();
       await dispatch(signingUp(newUser));
      navigate('/login');
    };
  
    const signInGoogle = async (e) => {
        e.preventDefault();
         dispatch(signInWithGoogle(user)) .then(() => {
          navigate('/home');
        })
        .catch((error) => {
          // Handle any errors here
          console.error('Authentication error:', error);
        });
    };


  return (




    
    <div className="container">
    <div className="form-container sign-in-container">
    <form >
            <h1>Create Account</h1>
            <div className="social-container">
            </div>
            <span>or use your email for registration</span>
            <div className="social-container">
                
                <a href="#" className="social"><GoogleIcon  onClick={signInGoogle}/></a>
            </div>
            <input type="text" placeholder="Name"
                                onChange={handleChange}
                               name='username' />
            <input type="email" placeholder="Email"  onChange={handleChange}
                               name='email'/>
            <input type="password" placeholder="Password"  onChange={handleChange}
                               name='password'/>
            <button onClick={registering}>Sign Up</button>
        </form>
    </div>
    <div className="overlay-container">
        <div className="overlay">
        
            <div className="overlay-panel overlay-right">
                <h1>Welcome Back!</h1>
                <p>To keep connected with us please login with your personal info</p>
                <Link href="/login">

                <button className="ghost" id="signIn" >Sign In</button></Link>
            </div>
        </div>
    </div>
</div>
  )
}

export default SignUp