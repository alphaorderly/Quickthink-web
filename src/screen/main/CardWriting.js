import { Add, Close } from '@mui/icons-material';
import React, { useRef, useState } from 'react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';

import Styles from './CardWriting.module.css';

import MDEditor from '@uiw/react-md-editor';
import rehypeSanitize from "rehype-sanitize";
import { getCodeString } from 'rehype-rewrite';
import katex from 'katex';

import User from '../../state/User';
import { useRecoilValue, useResetRecoilState } from 'recoil';

import Backend, {axios_wtoken} from '../../axios/Backend';


const CardWriting = () => {

    const navigate = useNavigate();

    const {state} = useLocation();

    console.log(state);

    const [value, setValue] = useState(state == null ? "" : state.content);

    const [tip, setTip] = useState(false);

    const [hashtags, setHashtags] = useState([]);

    const [adding, setAdding] = useState(false);

    const user = useRecoilValue(User);

    const newHashtagRef = useRef(null);

    const titleRef = useRef(null);

    const resetUser = useResetRecoilState(User);

    const fetchCard = async () => {
        const cardData = {
            title: titleRef.current.value,
            content: value,
            hashTags: hashtags,
            writtenDate: new Date(),
            latestReviewDate: new Date(),
            reviewCount: 0,
        }
        console.log(JSON.stringify(cardData))
        await Backend('card/write', {
            method: 'POST',
            headers: {
                accessToken: user.token,
            },
            data: JSON.stringify(cardData)
        }).catch(err => {
            if(err.response.status == 401) resetUser();
            if(err.response.status == 400) alert("잘못된 요청을 전송했습니다!");
        });
    }

    return (
        <div className={Styles.backdrop}>
            <div className={Styles.writingDiv}>
                <div className={Styles.topDiv}>
                    <input 
                        className={Styles.topTitleInput}
                        size={40}
                        placeholder={"제목을 입력해주세요"}
                        ref={titleRef}
                    />
                    <Close 
                        className={Styles.topClose}
                        onClick={() => {
                            navigate('/main', {replace: true})
                        }}
                    />
                </div>
                <div className={Styles.editorDiv}>
                    {
                        !tip
                        ?
                        <div>
                            <p onClick={() => setTip(true)} style={{cursor: 'pointer', color: 'grey'}} className={Styles.katexGuide}>작성 팁 보기</p>
                        </div>
                        :
                        <div>
                            <p onClick={() => setTip(false)} style={{cursor: 'pointer', color: 'grey'}} className={Styles.katexGuide}>작성 팁 가리기</p>
                            <p className={Styles.katexGuide}>수식 입력하기 : `$$수식$$` 자세한 내용은 <a target="_blank" href='https://cheris8.github.io/etc/MD-LaTex/'>이곳</a>을 참조해 주세요.</p>
                            <p className={Styles.katexGuide}>스페이스바 3번 입력으로 줄바꿈을 할수 있습니다.</p>
                        </div>
                    }
                    <MDEditor
                        value={value}
                        onChange={setValue}
                        className={Styles.editor}
                        style={{ whiteSpace: 'pre-wrap' }}
                        previewOptions={{
                            rehypePlugins: [[rehypeSanitize]],
                            components: {
                                code: ({ inline, children = [], className, ...props }) => {
                                  const txt = children[0] || '';
                                  if (inline) {
                                    if (typeof txt === 'string' && /^\$\$(.*)\$\$/.test(txt)) {
                                      const html = katex.renderToString(txt.replace(/^\$\$(.*)\$\$/, '$1'), {
                                        throwOnError: false,
                                        output: 'mathml'
                                      });
                                      return <code dangerouslySetInnerHTML={{ __html: html }} />;
                                    }
                                    return <code>{txt}</code>;
                                  }
                                  const code = props.node && props.node.children ? getCodeString(props.node.children) : txt;
                                  if (
                                    typeof code === 'string' &&
                                    typeof className === 'string' &&
                                    /^language-katex/.test(className.toLocaleLowerCase())
                                  ) {
                                    const html = katex.renderToString(code, {
                                      throwOnError: false,
                                    });
                                    return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
                                  }
                                  return <code className={String(className)}>{txt}</code>;
                                },
                              },
                        }}
                    />
                </div>
            </div>
            <div className={Styles.bottomDiv}>
                <div className={Styles.bottomHashtagsDiv}>
                    <div className={Styles.bottomHashtagIcon}>
                        <span className={Styles.bottomHashtagIconText}>#</span>
                    </div>
                    <div className={Styles.bottomHashtagItemDiv}>
                        {
                            hashtags.map(
                                (item, index) => {
                                    return (
                                        <div 
                                            key={item}
                                            className={Styles.bottomHashtagItem}
                                            onClick={() => {
                                                setHashtags(prev => {
                                                    const revised = prev.filter(hashtag => prev[prev.indexOf(item)] !== hashtag);
                                                    return revised
                                                })
                                            }}
                                        >
                                            #{item}
                                        </div>
                                    )
                                }
                            )
                        }
                        {
                            adding
                            &&
                            <input
                                ref={newHashtagRef}
                                className={Styles.bottomHashtagAdd} 
                                size={10}
                                onKeyDown={(k) => {
                                    if(k.key == "Enter") {
                                        if(hashtags.indexOf(newHashtagRef.current.value) != -1) {
                                            alert("중복되는 해시태그는 작성 불가능합니다.");
                                            newHashtagRef.current.value = "";
                                        } else {
                                            setHashtags(prev => [...prev, newHashtagRef.current.value]);
                                            setAdding(false);
                                        }
                                    }
                                }}
                            />
                        }
                        {
                            adding
                            ?
                            <Close 
                                className={Styles.bottonHashtagAddButton}
                                onClick={() => {
                                    setAdding(false);
                                }}
                            />
                            :
                            <Add 
                                className={Styles.bottonHashtagAddButton}
                                onClick={() => {
                                    setAdding(true);
                                }}
                            />
                        }
                    </div>
                </div>
                <div 
                    className={Styles.bottomCompleteDiv}
                    onClick={() => {
                        if(titleRef.current.value == "" || value == "") {
                            alert('제목과 글은 빈칸이여선 안됩니다.');
                        } else {
                            fetchCard();
                            navigate('/main', {replace: false});
                            navigate(0);
                        }
                    }}
                    onTouchStart={() => {
                        if(titleRef.current.value == "" || value == "") {
                            alert('제목과 글은 빈칸이여선 안됩니다.');
                        } else {
                            fetchCard();
                            navigate('/main', {replace: false});
                        }
                    }}
                >
                    <span>작성 완료</span>
                </div>
            </div>
        </div>
    )
}

export default CardWriting;