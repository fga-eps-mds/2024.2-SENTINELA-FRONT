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
    const [name, setName] = useState("");
    const [cpf, setCpf] = useState("");
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    const validateCPF = (cpf) => {
        cpf = cpf.replace(/\D/g, "");
        if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

        const calcVerifier = (cpf, factor) =>
            cpf
                .slice(0, factor - 1)
                .split("")
                .reduce((sum, num, index) => sum + parseInt(num) * (factor - index), 0);

        const firstDigit = (calcVerifier(cpf, 10) * 10) % 11 % 10;
        const secondDigit = (calcVerifier(cpf, 11) * 10) % 11 % 10;

        return (
            parseInt(cpf.charAt(9)) === firstDigit &&
            parseInt(cpf.charAt(10)) === secondDigit
        );
    };

    const handleSubmit = () => {
        if (!name || !cpf) {
            setShowModal(true);
            return;
        }

        if (validateCPF(cpf)) {
            setShowModal(false);
            navigate("/verificar-membro/ativo", { state: { name, cpf, status: "ATIVO" } });
        } else {
            setShowModal(true);
        }
    };

    return (
        <div className="content">
            <h1>Carteirinha digital</h1>
            <div className="content-form">
                <div className="form">
                    <p>Insira o nome do titular</p>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div className="form">
                    <p>Insira o CPF do titular</p>
                    <input
                        type="text"
                        id="cpf"
                        name="cpf"
                        value={cpf}
                        onChange={(e) => setCpf(e.target.value)}
                    />
                </div>
            </div>
            <button className="botao" onClick={handleSubmit}>
                VERIFICAR STATUS
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <h2>CPF não encontrado</h2>
                        <button onClick={() => setShowModal(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default VerifyMemberForm;
