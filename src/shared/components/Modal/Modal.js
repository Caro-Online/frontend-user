import React, { memo } from "react";
import { createPortal } from "react-dom";

import Backdrop from "../Backdrop/Backdrop";

import "./Modal.css";

const Modal = memo((props) => {
  return (
    <>
      {props.show ? <Backdrop clicked={props.modalClosed} /> : null}

      {createPortal(
        <div
          className="my-modal"
          style={{
            transform: props.show ? "translateY(0)" : "translateY(-100vh)",
            opacity: props.show ? 1 : 0,
          }}
        >
          {props.children}
        </div>,
        document.getElementById("modal-hook")
      )}
    </>
  );
});

export default Modal;
