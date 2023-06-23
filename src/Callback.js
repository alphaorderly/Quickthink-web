import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import queryString from "query-string"
import { useEffect } from 'react';
import { useState } from 'react';
import axios from 'axios';
import { redirect_url, resource_uri, token_uri } from './Const'
import Backend from './axios/Backend';
import { useRecoilState } from 'recoil';
import User from './state/User';

const Callback = () => {

    const navigate = useNavigate();

    const { search } = useLocation();

    let { code } = queryString.parse(search);

    const [show, setShow] = useState(null);

    const [user, setUser] = useRecoilState(User);

    const task = async () => {
        let tokenData = await axios(
            token_uri,
            {
                method: 'POST',
                params: {
                    code: code,
                    client_id: process.env.REACT_APP_CLIENT_ID,
                    client_secret : process.env.REACT_APP_CLIENT_SECRET,
                    redirect_uri: redirect_url,
                    grant_type: "authorization_code"
                },
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                }
            }
        )
        tokenData = tokenData.data;
        
        let accessToken = tokenData.access_token;

        let userData = await axios(
            resource_uri,
            {
                method: "GET",
                headers: {
                    "Authorization": "Bearer " + accessToken,
                }
            }
        )

        userData = userData.data;

        let finalData = {
            token: accessToken,
            googleName: userData.name,
            googleId: userData.id,
            profilePicture: userData.picture,
        }

        const answer = await Backend(
            'auth',
            {
                method: 'POST',
                data: JSON.stringify(finalData),
            }
        )

        if(answer.status == 200) {
            setUser(finalData);
        }

        navigate('/', {replace: true})
    }

    useEffect(
        () => {
            task();
        }, []
    )

    return (
        <div>
        
        </div>
    )

}

export default Callback;

