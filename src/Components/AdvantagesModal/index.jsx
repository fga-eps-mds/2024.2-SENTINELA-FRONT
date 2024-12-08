import React from "react";
import PropTypes from "prop-types"
import "./index.css";

export default function AdvantagesModal({title, description, onClose}) {

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <button className="close-button" onClick={onClose}>
            &times;
          </button>
          <div className="modal-header">
            <h2>{title}</h2>
          </div>
          <div className="modal-description">
            <p>
              {description}
            </p>
            <p>
              Para mais informações, entre em contato com o Sindicato pelo número{" "}
              <b>(61) 3321-1949</b>.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
/*
AdvantagesModal.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
*/