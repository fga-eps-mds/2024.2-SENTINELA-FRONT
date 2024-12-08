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

    // Função para validar o CPF
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

    // Função para formatar o CPF
    const formatCPF = (value) => {
        const onlyNumbers = value.replace(/\D/g, ""); // Remove caracteres não numéricos
        return onlyNumbers
            .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o primeiro ponto
            .replace(/(\d{3})(\d)/, "$1.$2") // Adiciona o segundo ponto
            .replace(/(\d{3})(\d{1,2})$/, "$1-$2"); // Adiciona o traço
    };

    // Manipulador de mudança do CPF
    const handleCpfChange = (e) => {
        const formattedCpf = formatCPF(e.target.value);
        setCpf(formattedCpf); // Atualiza o estado com o CPF formatado
    };

    // Função para lidar com o envio do formulário
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
                        onChange={handleCpfChange} // Formata o CPF ao digitar
                        maxLength="14" // Limita o tamanho ao formato XXX.XXX.XXX-XX
                    />
                </div>
            </div>
            <button className="botao" onClick={handleSubmit}>
                VERIFICAR STATUS
            </button>

            {showModal && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="botao3">
                            <h2>CPF não encontrado</h2>
                        </div>
                        <button className="botao2" onClick={() => setShowModal(false)}>OK</button>
                    </div>
                </div>
            )}
        </div>
    );
};


export default VerifyMemberForm;
