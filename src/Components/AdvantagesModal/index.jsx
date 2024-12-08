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
          <h2 className="modal-header">{title}</h2>

          <p className="modal-description">{description}</p>

          <p className="modal-contacts">
            Para mais informações, entre em contato com o Sindicato pelo número{" "}
            <b>(61) 3321-1949</b>.
          </p>

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