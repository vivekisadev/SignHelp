import React from "react";
import "./Modal.css";

const Modal = ({ src, alt, caption, onClose }) => {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <img src={src} alt={alt} />
        <p>{caption}</p>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
};

export default Modal;
