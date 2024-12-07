import "./index.css";
import LabeledTextField from "../../../../Components/LabeledTextField/index.jsx";
import PrimaryButton from "../../../../Components/PrimaryButton/index.jsx";
import SecondaryButton from "../../../../Components/SecondaryButton/index.jsx";
import UnderlinedTextButton from "../../../../Components/UnderlinedTextButton/index.jsx";
import { useState, useContext, useEffect } from "react";
import AuthContext, { useAuth } from "../../../../Context/auth.jsx";
import { useNavigate } from "react-router-dom";
import Card from "../../../../Components/Card/index.jsx";
import FieldText from "../../../../Components/FieldText/index.jsx";

import badgeLogo from "../../../assets/sindpol-logo.png";
import penalLogo from "../../../assets/penal_df-min.png.png";


const VerifyMemberActiveStatus = () => {
    return (
        <div className="carteirinha-container" ref={cardRef}>
            

}