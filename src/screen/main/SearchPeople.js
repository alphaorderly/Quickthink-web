import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useRecoilValue, useResetRecoilState } from 'recoil';
import Backend from '../../axios/Backend';
import User from '../../state/User';
import Styles from './SearchPeople.module.css';

const SearchPeople = () => {

    const user = useRecoilValue(User);

    const {state} = useLocation();

    const [users, setUsers] = useState([]);

    const navigate = useNavigate();

    const resetUser = useResetRecoilState(User);

    const searchData = async () => {
        let data = await Backend(
            'search',
            {
                method: "GET",
                headers: {
                    accessToken: user.token,
                },
                params: {
                    searchName: state.search
                }
            }
        ).catch(err => {
            if(err.response.status == 401) resetUser();
            if(err.response.status == 400) alert("잘못된 요청을 전송했습니다!");
        })
        setUsers(data.data.userList.filter(item => item.googleName != user.googleName))
    }

    useEffect(() => {
        searchData();
    }, [state.search])

    return (
        <div className={Styles.mainDiv}>
            {
                users.map((item) => {
                    return (
                        <div key={item.googleId} className={Styles.resultDiv}
                            onClick={() => {
                                navigate('/main/card/user/' + item.googleId, {replace: true})
                            }}
                        >
                            <div className={Styles.rowDiv}>
                                <img src={item.profilePicture} className={Styles.profileImage}></img>
                                <p className={Styles.name}>{item.googleName}</p>
                            </div>
                            <p className={Styles.profileText}>{item.profileText}</p>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default SearchPeople;