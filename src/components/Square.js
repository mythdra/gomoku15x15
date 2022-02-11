  
import React from 'react'

export default function Square(props) {
    var text ='';
    var colorText;
    if (props.value !== '.'){
        text = props.value;
    }
    colorText = text === 'X'? 'black':'red';

    return (
        <button className="square" onClick={props.onClick} style={{color: colorText}}>
            {text}   
        </button>
    )
}