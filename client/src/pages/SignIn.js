import Link from '@mui/material/Link';
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { signingIn,signInWithGoogle } from '../Redux/UserSlice';
import { useNavigate } from 'react-router-dom';
import GoogleIcon from '@mui/icons-material/Google';
const SignIn= () => {

    const  isAuth= useSelector(state => state.UserReducer.isAuth)

    const navigate = useNavigate()

    const dispatch = useDispatch()
    const [user, setUser] = useState({})
    const HandleChange = (e)=>{
      setUser({...user, [e.target.name] : e.target.value})
    }
    const LoginIn = async (e)=>{
            e.preventDefault();
          
    dispatch(signingIn(user))
    .then(() => {
        navigate('/home');
      })
      .catch((error) => {
        console.error('Authentication error:', error);
        navigate('/');
      });
  };

          
   
    const signInGoogle = async (e) => {
        e.preventDefault();

        dispatch(signInWithGoogle(user))
          .then(() => {
            navigate('/home');
          })
          .catch((error) => {
            console.error('Authentication error:', error);
            navigate('/');
          });
      };
    
     
  return (




   
    <div className="container">

    <div className="form-container sign-in-container">
        <form action="#">
            <h1>Sign in</h1>
            <div className="social-container">
                
                <a href="#" className="social"><GoogleIcon  onClick= {signInGoogle}    /></a>
            </div>
            <span>or use your account</span>
            <input type="email" placeholder="Email"  onChange={HandleChange}
                               name='email'/>
            <input type="password" placeholder="Password" onChange={HandleChange}
                               name='password' />
            <a href="#">Forgot your password?</a>
            <button onClick={LoginIn}>Sign In</button>
        </form>
    </div>
    <div className="overlay-container">
        <div className="overlay">
            <div className="overlay-panel overlay-right">
                <h1>Hello, Friend!</h1>
                <p>Enter your personal details and start journey with us</p>
                <Link href="/">
<button  className="ghost" >Sign Up</button> </Link>
            </div>
        </div>
    </div>
</div>
  )
}

export default SignIn