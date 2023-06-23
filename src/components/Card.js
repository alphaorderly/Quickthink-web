import { Circle, Create, RateReview, Visibility } from '@mui/icons-material';
import React from 'react';
import MDEditor from '@uiw/react-md-editor';

import Styles from './Card.module.css';
import { useNavigate } from 'react-router-dom';

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

const Card = (props) => {

    const card = props.card;

    const clickFunction = () => {
        navigate('/main/card/' + card.id, {replace: true});
    }

    const navigate = useNavigate();

    let written = SimpleDateTimeFormat(new Date(card.writtenDate), "yyyy.MM.dd HH:mm");

    if(card.isYours) {
        let review = SimpleDateTimeFormat(new Date(card.latestReviewDate), "yyyy.MM.dd HH:mm");
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