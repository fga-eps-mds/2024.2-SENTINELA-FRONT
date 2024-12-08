import "./index.css";
import LabeledTextField from "../../../../Components/LabeledTextField/index.jsx";
import PrimaryButton from "../../../../Components/PrimaryButton/index.jsx";
import SecondaryButton from "../../../../Components/SecondaryButton/index.jsx";
import UnderlinedTextButton from "../../../../Components/UnderlinedTextButton/index.jsx";
import React, { useState, useContext, useEffect } from "react";
import AuthContext, { useAuth } from "../../../../Context/auth.jsx";
import { useNavigate } from "react-router-dom";
import Card from "../../../../Components/Card/index.jsx";
import FieldText from "../../../../Components/FieldText/index.jsx";


const list = {
titular: 'Dannyeclisson',
cpf: 'XXX-XXX-XXX-XX',
status: 'ATIVO',
};


const VerifyMemberActiveStatus = () => {

    return (
        <div>
                <div>
                    <div className="info-block">
                        <strong>TITULAR:</strong><br/>
                        <p className="info-color-titular"><span>{list.titular}</span></p>
                    </div>
                    <div className="info-block">
                        <div>
                            <strong>CPF:</strong><br/>
                            <p className="info-color-titular"><span>{list.cpf}</span></p>
                        </div>
                        <div>
                            <strong>STATUS:</strong><br/>
                            <p className="info-color-titular"><span>{list.status}</span></p>
                        </div>
                    </div>
                </div>
        </div>
);
};

export default VerifyMemberActiveStatus;