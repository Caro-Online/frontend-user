import React from 'react'
import './BoardGame.css'
export default function Square(props) {
    const handleClick = () => {
        console.log("click");
        if (!props.disable) {
            return props.onClick()
        }
        return null;
    }

    return (
        <td className="square" onClick={handleClick} >
            {props.value}
        </td>
    );
}