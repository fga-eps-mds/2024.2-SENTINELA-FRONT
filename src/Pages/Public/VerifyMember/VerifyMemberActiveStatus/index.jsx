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


const VerifyMemberActiveStatus = () => {

    const { state } = useLocation(); // Dados passados pelo formulario
    const { name, cpf, status } = state || {}; // Valores padrão caso state seja nulo

    return (
        <div>
            <div>
                <div className="info-block">
                    <strong>TITULAR:</strong>
                    <br />
                    <p className="info-color-titular">
                        <span>{name}</span>
                    </p>
                </div>
                <div className="info-block">
                    <div>
                        <strong>CPF:</strong>
                        <br />
                        <p className="info-color-titular">
                            <span>{cpf}</span>
                        </p>
                    </div>
                    <div>
                        <strong>STATUS:</strong>
                        <br />
                        <p className="info-color-titular">
                            <span>{status}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default VerifyMemberActiveStatus;