import React from 'react';
import './BoardGame.css';
import x from '../../../../shared/assets/images/x.png';
import o from '../../../../shared/assets/images/o.png';
const Square = ({ disable, setDisable, isWin, value, onClick }) => {
  const handleClick = () => {
    if (!disable) {
      console.log('click');
      setDisable(!disable);
      return onClick();
    }
    return null;
  };

  const returnItem = () => {
    if (value === 'X') {
      return <img src={x} width="80%" height="80%" />;
    } else if (value === 'O') {
      return <img src={o} width="80%" height="80%" />;
    }
    return '';
  };

  return (
    <td
      className="square"
      onClick={handleClick}
      style={{ backgroundColor: isWin ? 'yellow' : '' }}
    >
      {returnItem()}
    </td>
  );
};

export default React.memo(Square);
