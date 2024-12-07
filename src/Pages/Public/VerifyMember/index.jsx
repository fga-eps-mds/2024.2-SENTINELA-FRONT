import "./index.css";
import LabeledTextField from "../../../Components/LabeledTextField";
import PrimaryButton from "../../../Components/PrimaryButton";
import SecondaryButton from "../../../Components/SecondaryButton";
import UnderlinedTextButton from "../../../Components/UnderlinedTextButton";
import { useState, useContext, useEffect } from "react";
import AuthContext, { useAuth } from "../../../Context/auth";
import { useNavigate } from "react-router-dom";
import Card from "../../../Components/Card";
import FieldText from "../../../Components/FieldText/index.jsx";


const VerifyMember = () => {

    return (
        <div className="content">
            <h1>
                Carteirinha digital
            </h1>
            <div className="form">
                <p>Insira o nome do titular</p>
                <input type="text" id="name" name="name"/>
            </div>
            <div className="form">
                <p>Insira o CPF do titular</p>
                <input type="text" id="name" name="name"/>
            </div>
            <PrimaryButton text={'Verificar status'}
        </div>
    );
}

export default VerifyMember;
