import { Close } from '@mui/icons-material';
import React from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { TailSpin } from 'react-loader-spinner';
import { useNavigate } from 'react-router-dom';

import Styles from './GPT.module.css';
import MDEditor from '@uiw/react-md-editor';


/*

API 답변 예시

{
    "id": "chatcmpl-78KyJW6ph6CPyUEopg9H7WAHrteL5",
    "object": "chat.completion",
    "created": 1682221595,
    "model": "gpt-3.5-turbo-0301",
    "usage": {
        "prompt_tokens": 21,
        "completion_tokens": 288,
        "total_tokens": 309
    },
    "choices": [
        {
            "message": {
                "role": "assistant",
                "content": "React의 Hook은 함수형 컴포넌트에서 상태(state)나 생명주기(lifecycle) 등의 기능을 사용할 수 있도록 도와주는 기능입니다. \n\nuseState는 가장 기본적인 Hook으로, 컴포넌트에서 상태를 관리할 수 있습니다. \n\nuseEffect는 컴포넌트가 마운트, 언마운트, 업데이트 될 때 실행되는 함수를 정의할 수 있습니다. \n\nuseContext는 컴포넌트 간에 데이터를 공유할 수 있도록 해줍니다. \n\nuseReducer는 상태를 관리하기 위한 컴포넌트 내부의 함수를 정의하고, 이를 통해 상태를 업데이트할 수 있습니다. \n\n그 외에도 useRef, useCallback, useMemo 등 다양한 Hook이 있습니다. \n\nHook을 사용하면 함수형 컴포넌트에서도 클래스형 컴포넌트와 같은 기능을 사용할 수 있어서 코드의 가독성과 유지보수성이 높아집니다."
            },
            "finish_reason": "stop",
            "index": 0
        }
    ]
}

*/

const GPT = () => {

    const navigate = useNavigate();

    const [answers, setAnswers] = useState([]);
    const [questions, setQuestions] = useState([]);

    const questionRef = useRef(null);

    const [loading, setLoading] = useState(false);

    const URI = "https://api.openai.com/v1/chat/completions"
    const body = {
        model : "gpt-3.5-turbo",
        messages: [
                {
                    role: "system", 
                    content: "당신은 컴퓨터 과학을 가르키는 교수입니다."
                },
                {
                    role: "user", 
                    content: "질문이 여기에 들어갑니다."
                }
            ],
        temperature: 0.7,
    }

    const queryToGpt = async () => {
        body.messages[1].content = questionRef.current.value;
        const answer = await fetch(URI, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + process.env.REACT_APP_GPT,
            },
            mode: 'cors',
        }).then(
            (response) => response.json()
        ).then(
            (js) => {
                console.log(js)
                questionRef.current.value="";
                let rawAnswer = js['choices'][0]['message']['content'].replace('\n\n', '\n');
                setAnswers(prev => [...prev, rawAnswer]);
                setLoading(false)
            }
        )
    }

    return (
        <div className={Styles.backdrop}>
            <div className={Styles.gptDiv}>
                <div className={Styles.topBar}>
                    <p className={Styles.topTitle}>CHATGPT에게 물어보기</p>
                    <Close 
                        className={Styles.topClose}
                        onClick={() => {
                            navigate('/main', {replace: true})
                        }}
                    />
                </div>
                <div className={Styles.chatDiv}>
                    {
                        questions.map(
                            (item, index) => {
                                return (
                                    <div key={index + item} className={Styles.singleQnaDiv}>
                                        <div className={Styles.questionDiv}>
                                            {questions[index]}
                                        </div>
                                        <div className={Styles.answerDiv}>
                                            <div className={Styles.answer}>
                                                {
                                                    answers[index] === undefined
                                                    ?
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
                                                    :
                                                    <MDEditor.Markdown source={answers[index]} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent' }}  />
                                                }
                                            </div>
                                            {
                                                answers[index] !== undefined
                                                &&
                                                <button 
                                                    className={Styles.cardWrite}
                                                    onClick={() => {
                                                        console.log(answers[index]);
                                                        navigate(`/main/write`, {replace: false, state: { content: answers[index] }});
                                                    }}
                                                >
                                                    카드 작성하기
                                                </button>
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        )
                    }
                </div>
                <div className={Styles.chatInputDiv}>
                    <input 
                        className={Styles.chatInput} 
                        ref={questionRef}
                        onKeyDown={(e) => {
                            if(e.key === 'Enter') {
                                if(questionRef.current.value === "") {
                                    alert("빈 질문은 안됩니다.")
                                    return;
                                }
                                setLoading(true);
                                setQuestions(prev => {prev = [...prev, questionRef.current.value]; console.log(prev); return prev;})
                                queryToGpt();
                            }
                        }}
                    />
                    <button
                        disabled={loading} 
                        className={Styles.chatButton}
                        onClick={
                            () => {
                                if(questionRef.current.value === "") {
                                    alert("빈 질문은 안됩니다.")
                                    return;
                                }
                                setLoading(true);
                                setQuestions(prev => {prev = [...prev, questionRef.current.value]; console.log(prev); return prev;})
                                queryToGpt();
                            }
                        }
                    >전송하기</button>
                </div>
            </div>
        </div>
    )
}

export default GPT;