import "./index.css";

//import LabeledTextField from "../../../../Components/LabeledTextField/index.jsx";
//import PrimaryButton from "../../../../Components/PrimaryButton/index.jsx";
//import SecondaryButton from "../../../../Components/SecondaryButton/index.jsx";
//import UnderlinedTextButton from "../../../../Components/UnderlinedTextButton/index.jsx";
import { useState } from "react";
//import AuthContext, { useAuth } from "../../../../Context/auth.jsx";
import { useNavigate } from "react-router-dom";
//import Card from "../../../../Components/Card/index.jsx";
//import FieldText from "../../../../Components/FieldText/index.jsx";

const VerifyMemberForm = () => {
  const [name, setName] = useState("");
  const [cpf, setCpf] = useState("");
  const [showCpfModal, setShowCpfModal] = useState(false);
  const [showNameModal, setShowNameModal] = useState(false);
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

    const firstDigit = ((calcVerifier(cpf, 10) * 10) % 11) % 10;
    const secondDigit = ((calcVerifier(cpf, 11) * 10) % 11) % 10;

    return (
      parseInt(cpf.charAt(9)) === firstDigit &&
      parseInt(cpf.charAt(10)) === secondDigit
    );
  };

  const validateName = (name) => {
    return /^[A-Za-záàâãéèêíïóôõöúçñÁÀÂÃÉÈÍÏÓÔÕÖÚÇÑ ]+$/.test(name);
  };

  // Função para formatar o CPF
  const formatCPF = (value) => {
    const onlyNumbers = value.replace(/\D/g, "");
    return onlyNumbers
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d)/, "$1.$2")
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
  };

  // Manipulador de mudança do CPF
  const handleCpfChange = (e) => {
    const formattedCpf = formatCPF(e.target.value);
    setCpf(formattedCpf);
  };

  // Função para lidar com o envio do formulário
  const handleSubmit = () => {
    if (!name || !cpf) {
      setShowCpfModal(true);
      return;
    }

    if (!validateName(name)) {
      setShowNameModal(true);
      return;
    }

    if (!validateCPF(cpf)) {
      setShowCpfModal(true);
      return;
    }

    // Se passou por todas as validações
    navigate("/verificar-membro/ativo", {
      state: { name, cpf, status: "ATIVO" },
    });
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
            onChange={handleCpfChange}
            maxLength="14"
          />
        </div>
      </div>
      <button className="botao" onClick={handleSubmit}>
        VERIFICAR STATUS
      </button>

      {showCpfModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="botao3">
              <h2>CPF inválido ou não encontrado</h2>
            </div>
            <button className="botao2" onClick={() => setShowCpfModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}

      {showNameModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="botao3">
              <h2>Nome inválido. Use apenas letras e espaços</h2>
            </div>
            <button className="botao2" onClick={() => setShowNameModal(false)}>
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifyMemberForm;
