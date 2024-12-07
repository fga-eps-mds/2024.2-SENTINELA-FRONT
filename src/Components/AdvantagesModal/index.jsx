import React from "react";
import "./index.css";

export default function AdvantagesModal() {
  return (
    <>
      <div className="modal-overlay">
        <div className="modal-box">
          <button className="close-button">
            &times;
          </button>
          <div className="modal-header">
            <h2>Titulo do Beneficio</h2>
          </div>
          <div className = "modal-description">
            <p>
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
              eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
              ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
              aliquip ex ea commodo consequat. Duis aute irure dolor in
              reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
              pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
              culpa qui officia deserunt mollit anim id est laborum."
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
