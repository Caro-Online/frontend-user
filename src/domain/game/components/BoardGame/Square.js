import React from "react";
import "./BoardGame.css";
import x from "../../../../shared/assets/images/x.png";
import o from "../../../../shared/assets/images/o.png";
const Square = ({ disable, setDisable, isWin, value, onClick, isPrevious }) => {
  const handleClick = () => {
    if (!disable && value === null) {
      console.log("click");
      setDisable(!disable);
      return onClick();
    }
    return null;
  };

  const returnItem = () => {
    if (value === "X") {
      return <img alt="x" src={x} width="80%" height="80%" />;
    } else if (value === "O") {
      return <img alt="o" src={o} width="80%" height="80%" />;
    }
    return <div style={{ width: "100%", height: "100%" }}></div>;
  };
  const styles = {
    square: {
      '&:hover': {
        backgroundColor: value ? "yellow" : "white",
        cursor: value ? "pointer" : "no-drop"
      },
      backgroundColor: isWin ? "yellow" : (isPrevious ? "greenyellow" : "white")
    }
  }

  return (
    <td
      className='square'
      onClick={handleClick}
      style={styles.square}
    >
      {returnItem()}
    </td>
  );
};

export default React.memo(Square);
