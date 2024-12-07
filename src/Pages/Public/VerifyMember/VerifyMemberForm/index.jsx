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


const VerifyMemberForm = () => {

    return (
        <div className="content">
            <h1>
                Carteirinha digital
            </h1>
            <div className="content-form"> 
            <div className="form">
                <p>Insira o nome do titular</p>
                <input type="text" id="name" name="name"/>
            </div>
            <div className="form">
                <p>Insira o CPF do titular</p>
                <input type="text" id="name" name="name"/>
            </div>
            </div>
            <body>
                <button className="botao" onclick="window.location.href='https://www.example.com';">VERIFICAR STATUS</button>
            </body>
        </div>
    );
}

export default VerifyMemberForm;
