import "./index.css";
import { Link } from "react-router-dom";
import sentinela_logo from "../../../assets/sentinela-logo.png";
import sindpol_logo from "../../../assets/sindpol-logo.png";
import AdvantagesCard from "../../../Components/AdvantagesCard";
import LabeledTextField from "../../../Components/LabeledTextField";
import PrimaryButton from "../../../Components/PrimaryButton";
import SecondaryButton from "../../../Components/SecondaryButton";
import UnderlinedTextButton from "../../../Components/UnderlinedTextButton";
import { useState, useContext, useEffect } from "react";
import AuthContext, { useAuth } from "../../../Context/auth";
import { useNavigate } from "react-router-dom";
import AdvantagesModal from "../../../Components/AdvantagesModal";
import { getBenefitsForm } from "../../../Services/benefitsService";

export default function loginNovo() {
  const context = useContext(AuthContext);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [error, setError] = useState(""); // Adiciona um estado para mensagens de erro

  const handleLogin = async () => {
    if (!email || !senha) {
      setError("Por favor, preencha todos os campos.");
      return;
    }

    setError("");

    const message = await context.Login(email, senha);

    if (message) {
      alert("erro de login. Senha ou email incorretos.");
    } else {
      navigate("/home");
    }
  };

  const handlePasswordRecovery = () => {
    navigate("/recuperar-senha");
  };

  /* ------------Funções de Vantagens------------ */

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalTitle, setModalTitle] = useState("");
  const [modalDescription, setModalDescription] = useState("");
  const [advantages, setAdvantages] = useState([]);

  const handleOpenModal = (title, description) => {
    setModalTitle(title);
    setModalDescription(description);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => setIsModalOpen(false);

  useEffect(() => {
    const getAdvantages = async () => {
      const response = await getBenefitsForm();
      setAdvantages(response);
    };

    getAdvantages();
  }, []);

  useEffect(() => {
    if (user) {
      navigate("/home");
      window.location.reload();
    }
  }, [user, navigate]);

  useEffect(() => {
    console.log("Modal Title:", modalTitle);
    console.log("Modal Description:", modalDescription);
  }, [modalTitle, modalDescription]);
  return (
    <>
      <div className="navBar">
        <div className="navRight">
          <img src={sentinela_logo} alt="Logo Sentinela" />
        </div>

        <div className="navLeft">
          <Link href="" className="navLink1">
            Vantagens
          </Link>
          <Link to="/filiacao" className="navLink2">
            Filiar
          </Link>
        </div>
      </div>

      <div className="sideText">
        <h1 className="tittle">Bem-vindo ao SINDPOL-DF</h1>

        <h5 className="subTittle">
          O Sindicato da Polícia Penal do Distrito Federal
        </h5>

        <p className="lead">
          Defendemos seus direitos, fortalecemos sua voz e construímos uma
          categoria unida e respeitada. Faça parte dessa força e contribua para
          um futuro melhor para todos os policiais penais do Distrito Federal.
        </p>

        <div className="links">
          <Link to="/filiacao" className="links-link">
            Filiar-me ao sindicato
          </Link>
          <Link href="#" className="links-link">
            Ver vantagens
          </Link>
        </div>
      </div>

      <div className="sideLogin">
        <div className="sideLoginImage">
          <img src={sindpol_logo} alt="Logo SindPol" />
        </div>

        <div className="sideLoginElements">
          <h2>Já é filiado? Entre na sua conta</h2>
          <LabeledTextField
            label="EMAIL"
            placeholder="Digite seu email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <LabeledTextField
            label="SENHA"
            placeholder="Digite sua senha"
            type="password"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
          <PrimaryButton
            text="Entrar"
            onClick={() => handleLogin()}
            maxWidth="400px"
          />
          {error && <div className="error-message">{error}</div>}{" "}
          {/* Exibe a mensagem de erro */}
          <div className="recupera-senha">
            <UnderlinedTextButton
              key="recupera-senha"
              text="Esqueci a senha"
              onClick={() => handlePasswordRecovery()}
            />
          </div>
        </div>
      </div>

      <div className="advantages">
        <div className="advantages-titile">
          <h1>Porque se filiar?</h1>
        </div>

        <div className="advantages-subtitile">
          <h2>
            Venha conhecer os benefícios que os filiados ao SINDPOL-DF possuem
          </h2>
        </div>

        <div className="containerCards">
          {advantages.map((advantage) => (
            <AdvantagesCard
              key={advantage._id}
              title={advantage.nome}
              onClick={() =>
                handleOpenModal(advantage.nome, advantage.descricao)
              }
            />
          ))}
        </div>
        {isModalOpen && (
          <AdvantagesModal
            title={modalTitle}
            description={modalDescription}
            onClose={() => handleCloseModal()}
          />
        )}
      </div>
    </>
  );
}
