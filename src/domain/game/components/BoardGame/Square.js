import React from 'react'
import './BoardGame.css'
export default function Square(props) {

    return (
        <button className="square" onClick={props.onClick} style={{}}>
            {props.value}
        </button>
    );
}
