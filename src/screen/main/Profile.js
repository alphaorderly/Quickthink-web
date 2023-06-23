/**
 * 
 * 프로필 수정 화면입니다.
 * 
 */

import { Close } from '@mui/icons-material';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRecoilState, useResetRecoilState } from 'recoil';
import User from '../../state/User';
import Backend from '../../axios/Backend';

import Styles from './Profile.module.css';

const Profile = () => {

    const [user, setUser] = useRecoilState(User);

    const resetUser = useResetRecoilState(User);

    const navigate = useNavigate();

    const [profileText, setProfileText] = useState("");

    const inputRef = useRef(null);

    // Firebase로부터 프로필 텍스트 가져오기
    const fetchData = async () => {
        const data = await Backend('profile', {
            method: "GET",
            headers: {
                accessToken: user.token,
            },
            params: {
                googleId: user.googleId,
            }
        }).catch(err => {
            if(err.response.status == 401) resetUser();
            if(err.response.status == 400) alert("잘못된 요청을 전송했습니다!");
        });
        setProfileText(data.data.text);
    }

    // Firebase에 새로운 프로필 텍스트 저장하기
    const updateData = async () => {
        const output = await Backend('profile', {
            method: "POST",
            headers: {
                accessToken: user.token,
            },
            params: {
                googleId: user.googleId,
            },
            data: JSON.stringify({
                text: inputRef.current.value,
            })
        }).catch(err => {
            if(err.response.status == 401) resetUser();
            if(err.response.status == 400) alert("잘못된 요청을 전송했습니다!");
        })
    }

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className={Styles.backdrop}>
            <div className={Styles.profileDiv}>
                <div className={Styles.topProfile}>
                    <div className={Styles.topProfileDetail}>
                        <img src={user.profilePicture} className={Styles.topProfilePicture} />
                        <p className={Styles.topProfileName}>{user.googleName}</p>
                    </div>
                    <Close className={Styles.topProfileClose} onClick={() => {navigate('/main', {replace: true});}}/>
                </div>
                <textarea
                    defaultValue={profileText}
                    ref={inputRef}
                    cols={60}
                    rows={5}
                    className={Styles.profileText}
                />
                <div className={Styles.bottomProfileDiv}>
                    <div className={Styles.bottomProfileButtonLogout} onClick={() => {
                            resetUser();
                            navigate('/main', {replace: true});
                        }}>
                        <p>로그아웃</p>
                    </div>
                    <div className={Styles.bottomProfileButtonChange} onClick={() => {updateData(); navigate('/main', {replace: true});}}>
                        <p>프로필 문구 수정 완료</p>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Profile