import React from 'react'
import './BoardGame.css'
import x from '../../../../shared/assets/images/x.png'
import o from '../../../../shared/assets/images/o.png'
export default function Square(props) {
    const handleClick = () => {

        if (!props.disable) {
            console.log("click");
            props.setDisable(!props.disable)
            return props.onClick()

        }
        return null;
    }

    const returnItem = () => {
        if (props.value === 'X') {
            return <img src={x} width="80%" height="80%" />
        } else if (props.value === 'O') {
            return <img src={o} width="80%" height="80%" />
        }
        return '';
    }

    return (
        <td className="square" onClick={handleClick} style={{ backgroundColor: props.isWin ? 'yellow' : '' }}>
            { returnItem()}
        </td >
    );
}