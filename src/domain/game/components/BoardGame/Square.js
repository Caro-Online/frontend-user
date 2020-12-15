import React from 'react'
import './BoardGame.css'
export default function Square(props) {

    return (
        <td className="square" onClick={props.onClick} >
            {props.value}
        </td>
    );
}