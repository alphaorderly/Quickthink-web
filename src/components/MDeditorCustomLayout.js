import React from 'react';
import Styles from './MDeditorCustomLayout.module.css'

export const textArea = (props, opt) => {

    return (
        <textarea
            className={Styles.textWriting}
            onChange={opt.onChange}
            rows={100}
        >
        
        </textarea>
    )
}