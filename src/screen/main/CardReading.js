import { Close, Create, RateReview } from '@mui/icons-material';
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { TailSpin } from 'react-loader-spinner';

import Styles from './CardReading.module.css'
import { useRecoilValue, useResetRecoilState } from 'recoil';
import User from '../../state/User';
import { useEffect } from 'react';
import MDEditor from '@uiw/react-md-editor';

import Backend from '../../axios/Backend';

function SimpleDateTimeFormat(date, pattern) {
	var dateString = pattern.replace(/(yyyy|MM|dd|HH|mm|ss|SSS)/g, function(match) {
		var matchString = "";
		switch(match) {
			case "yyyy":
				matchString = date.getFullYear();
				break;
			case "MM":
				matchString = date.getMonth() + 1;
				break;
			case "dd":
				matchString = date.getDate();
				break;
			case "HH":
				matchString = date.getHours();
				break;
			case "mm":
				matchString = date.getMinutes();
				break;
			case "ss":
				matchString = date.getSeconds();
				break;
			case "SSS":
				matchString = date.getMilliseconds();
				break;
			default :
				matchString = match;
				break;
		}
		if (match == "SSS") {
			if (matchString < 10) {
				matchString = "00" + matchString;
			} else if (matchString < 100) {
				matchString = "0" + matchString;
			}
		} else {
			if ((typeof(matchString) == "number" && matchString < 10)) {
				matchString = "0" + matchString;
			}
		}
		return matchString;
	});

	return dateString;
}

const CardReading = () => {

    const navigate = useNavigate();

    const user = useRecoilValue(User);

    const [card, setCard] = useState(null);

    const { id } = useParams()

    const resetUser = useResetRecoilState(User);

    const fetchCard = async () => {
        let data = await Backend('card/single',{
            method: "GET",
            headers: {
                accessToken: user.token,
            },
            params: {
                cardId: id
            }
        }).catch(err => {
            if(err.response.status == 401) resetUser();
            if(err.response.status == 400) alert("잘못된 요청을 전송했습니다!");
        });

        if(data.status == 401) {
            resetUser();
        }

        data = data.data;
        console.log(data);
        setCard(data);
    }

    useEffect(() => {
        fetchCard();
    }, [])

    if(card === null) {
        return (
            <div className={Styles.spinnerDiv}>
                <TailSpin
                    height="40"
                    width="40"
                    color="black"
                    ariaLabel="tail-spin-loading"
                    radius="1"
                    wrapperStyle={{}}
                    wrapperClass=""
                    style={{ whiteSpace: 'pre-wrap' }}
                    visible={true}
                />
            </div>
        )
    }

    console.log(card);

    return (
        <div className={Styles.backdrop}>
            <div className={Styles.readingDiv}>
                <div className={Styles.topDiv}>
                    <p 
                        className={Styles.topTitle}
                    >
                    {card.title}
                    </p>
                    {
                        card.isYours
                        &&
                        <p className={Styles.topButton} onClick={
                            async () => {
                                const output = await Backend(
                                    'card/remove',
                                    {
                                        method: "DELETE",
                                        headers:{
                                            accessToken: user.token
                                        },
                                        params: {
                                            cardId: id
                                        }
                                    }
                                ).catch(err => {
                                    if(err.response.status == 401) resetUser();
                                    if(err.response.status == 400) alert("잘못된 요청을 전송했습니다!");
                                });
                                navigate('/main', {replace: true})
                            }
                        }>삭제하기</p>
                    }
                    {
                        card.isYours
                        &&
                        <p className={Styles.topButton} onClick={() => {
                            navigate('/main/correction/' + id, {replace: true})
                        }}>수정하기</p>
                    }
                    <Close 
                        className={Styles.topClose}
                        onClick={() => {
                            if(card.isYours) {
                                navigate('/main', {replace: true})
                            } else {
                                navigate('/main/card/user/' + card.googleId, {replace: true})
                            }
                        }}
                    />
                </div>
                <div className={Styles.contentDiv}>
                    <MDEditor.Markdown source={card.content} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent' }}  />
                </div>
                    {
                        card.isYours
                        ?
                        <div className={Styles.infoDiv}>
                            <p className={Styles.infoText}>{card.reviewCount} 회 복습</p>
                            <p className={Styles.infoText}><Create fontSize='12px' /> {SimpleDateTimeFormat(new Date(card.writtenDate), "yyyy.MM.dd HH:mm")}</p>
                            <p className={Styles.infoText}><RateReview fontSize='12px' /> {SimpleDateTimeFormat(new Date(card.latestReviewDate), "yyyy.MM.dd HH:mm")}</p>
                        </div>
                        :
                        <div className={Styles.infoDiv}>
                            <p><Create fontSize='12px' /> {SimpleDateTimeFormat(new Date(card.writtenDate), "yyyy.MM.dd HH:mm")}</p>
                        </div>
                    }
            </div>
            <div className={Styles.bottomDiv}>
                <div className={Styles.bottomHashtagDiv}>
                    <div className={Styles.bottomHashtagItemDiv}>
                        {
                            card.hashTags.map(
                                (item, index) => {
                                    return (
                                        <div 
                                            key={item}
                                            className={Styles.bottomHashtagItem}
                                        >
                                            #{item}
                                        </div>
                                    )
                                }
                            )
                        }
                    </div>
                </div> 
                {
                card.isYours
                &&
                    <div 
                        className={Styles.bottomCompleteDiv}
                        onClick={ async () => {
                            const output = await Backend(
                                'card/review',
                                {
                                    method: "POST",
                                    headers:{
                                        accessToken: user.token
                                    },
                                    params: {
                                        cardId: id
                                    }
                                }
                            ).catch(err => {
                                if(err.response.status == 401) resetUser();
                                if(err.response.status == 400) alert("잘못된 요청을 전송했습니다!");
                            })
                            navigate('/main', {replace: true})
                        }}
                    >
                    <span>복습 완료</span>
                    </div>
                }
            </div>
        </div>
    )
}

export default CardReading;