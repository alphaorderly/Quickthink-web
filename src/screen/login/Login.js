import React, { useState } from 'react';
import Styles from './Login.module.css';
import Logo from '../../assets/images/logo.png';
import LoginImage from '../../assets/images/google_login.png'


const Login = () => {
        return (
            <div className={Styles.mainDiv}>
                <img src={Logo} className={Styles.mainLogo} />
                <p className={Styles.mainText}>서비스 사용을 위해 구글 로그인을 해 주세요</p>
                <img src={LoginImage} className={Styles.loginImage} onClick={() => {
                    document.location.reload();
                    window.open('https://api.quickthink.online/api/google', "_self")
                }}/>
            </div>
        )
}

export default Login;