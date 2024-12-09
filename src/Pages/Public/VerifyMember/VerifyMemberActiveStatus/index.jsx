import "./index.css";
import LabeledTextField from "../../../../Components/LabeledTextField/index.jsx";
import PrimaryButton from "../../../../Components/PrimaryButton/index.jsx";
import SecondaryButton from "../../../../Components/SecondaryButton/index.jsx";
import UnderlinedTextButton from "../../../../Components/UnderlinedTextButton/index.jsx";
import React, { useState, useContext, useEffect } from "react";
import AuthContext, { useAuth } from "../../../../Context/auth.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import Card from "../../../../Components/Card/index.jsx";
import FieldText from "../../../../Components/FieldText/index.jsx";
import badgeLogo from "../../../../assets/sindpol-logo.png";


const VerifyMemberActiveStatus = () => {

    const { state } = useLocation(); // Dados passados pelo formulario
    const { name, cpf, status } = state || {}; // Valores padrão caso state seja nulo

    return (
        <div className="block-container">
        <div className="block">
          <header className="block-header">
            <h1>SINDPOL-DF</h1>
            <p>SINDICATO DOS POLICIAIS PENAIS DO DISTRITO FEDERAL</p>
            </header>
            <div>
                <div className="inf-line">
                    <div className="inf-block">
                    <strong>TITULAR:</strong>
                    <br />
                    <p className="inf-color-titular">
                        <span>{name}</span>
                    </p>
                </div>
                </div>
                <div className="inf-line">
                    <div className="inf-block">
                        <strong>CPF:</strong>
                        <br />
                        <p className="inf-color">
                            <span>{cpf}</span>
                        </p>
                    </div>
                    <div className="inf-block">
                    <strong>STATUS:</strong>
                        <br />
                        <p className="inf-color">
                            <span>{status}</span>
                        </p>
                    </div>
                    <div className="foote-logos">
                        <img src={badgeLogo} alt="Logo 1" className="foot-logo" />
                        <p className="Sindicalizado">SINDICALIZADO</p>
                    </div>
                    </div>
                </div>
            </div>
        </div>
       
    );
};

export default VerifyMemberActiveStatus;