import React from "react";
import "./Board.css";
import x from "src/shared/assets/images/x.png";
import o from "src/shared/assets/images/o.png";
const Square = ({ isWin, value, onClick, isPrevious }) => {
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
      "&:hover": {
        backgroundColor: value ? "yellow" : "white",
        cursor: value ? "pointer" : "no-drop",
      },
      backgroundColor: isWin ? "yellow" : isPrevious ? "greenyellow" : "white",
    },
  };

  return (
    <td className="square" style={styles.square}>
      {returnItem()}
    </td>
  );
};

export default React.memo(Square);
