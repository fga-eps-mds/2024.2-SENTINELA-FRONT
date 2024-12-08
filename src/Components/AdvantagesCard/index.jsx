import React from 'react';
import PropTypes from "prop-types"
import AdvantagesModal from "../AdvantagesModal";
import './index.css';  

export default function AdvantagesCard({title, onClick}) {

  return (
    <>
    <div className="containerCard">
      <p className="text">{title}</p>
        <button className="link" onClick = {onClick}>Saber mais</button>
    </div>
  </>    
  );
}

AdvantagesCard.propTypes = {
  title: PropTypes.string,
  onClick: PropTypes.func,
};
