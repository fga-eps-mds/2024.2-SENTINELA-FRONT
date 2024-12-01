import React from 'react';
import AdvantagesModal from "../AdvantagesModal";
import { FaBalanceScale } from 'react-icons/fa';
import { HiAcademicCap } from "react-icons/hi2";
import { TbDental } from "react-icons/tb";
import './index.css';  

export default function AdvantagesCard() {
  return (
    <>
    <div className="containerCards">

    <div className="containerCard">
      <FaBalanceScale className="icon" />
      <p className="text">Auxílio Jurírico</p>
        <a href={<AdvantagesModal />} className="link">Saber mais</a>
    </div>
    </div>
</>    
  );
}
