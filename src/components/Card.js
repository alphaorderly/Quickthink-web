import { Circle, Create, RateReview, Visibility } from '@mui/icons-material';
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

import Styles from './Card.module.css';
import { useNavigate } from 'react-router-dom';
import DateFunction from './DateFunction';

const Card = (props) => {

    const card = props.card;

    const clickFunction = () => {
        navigate('/main/card/' + card.id, {replace: true});
    }

    const navigate = useNavigate();

    let written = DateFunction(new Date(card.writtenDate), "MM.dd HH:mm");

    if(card.isYours) {
        let review = DateFunction(new Date(card.latestReviewDate), "MM.dd HH:mm");
        return (
            <div 
                style={{
                    ...props.style,
                }}
                className={Styles.cardDiv}
                onClick={() => {
                    clickFunction();
                }}
            >
                <div className={Styles.hashtagsDiv}>
                    {
                        card.hashTags.map(
                            item => {
                                return <p key={item} className={Styles.hashtag}>#{item}</p>
                            }
                        )
                    }
                </div>
                <div className={Styles.titleDiv}>
                    <p>{card.title}</p>
                </div>
                <div className={Styles.articleDiv}>
                    <MDEditor.Markdown source={card.content} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent' }}  />
                </div>
                <div className={Styles.statDiv}>
                    <p>{card.reviewCount} <Visibility fontSize='12px' className={Styles.statIcon}/></p>
                    <p><Create fontSize='12px' className={Styles.statIcon} /> {written}</p>
                    <p><RateReview fontSize='12px' className={Styles.statIcon}/> {review}</p>
                </div>
            </div>
        )
    } else {
        return (
            <div 
                style={{
                    ...props.style,
                }}
                className={Styles.cardDiv}
                onClick={() => {
                    clickFunction();
                }}
            >
                <div className={Styles.hashtagsDiv}>
                    {
                        card.hashTags.map(
                            item => {
                                return <p key={item} className={Styles.hashtag}>#{item}</p>
                            }
                        )
                    }
                </div>
                <div className={Styles.titleDiv}>
                    <p>{card.title}</p>
                </div>
                <div className={Styles.articleDiv}>
                    <MDEditor.Markdown source={card.content} style={{ whiteSpace: 'pre-wrap', backgroundColor: 'transparent' }}  />
                </div>
                <div className={Styles.statDiv}>
                    <p><Create fontSize='12px' className={Styles.statIcon} /> {written}</p>
                </div>
            </div>
        )
    }
}

export default Card;