import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FieldSelect from "../../../../Components/FieldSelect";
import FieldText from "../../../../Components/FieldText";
import Modal from "../../../../Components/Modal";
import PrimaryButton from "../../../../Components/PrimaryButton";
import SecondaryButton from "../../../../Components/SecondaryButton";
import {
  deleteUserById,
  getRoles,
  getLoggedUser,
  updateLogged
} from "../../../../Services/userService";
import { checkAction, usePermissions } from "../../../../Utils/permission";
import "./index.css";
import {
  isValidCelular,
  isValidEmail,
  mascaraTelefone,
} from "../../../../Utils/validators";

export default function UserUpdatePage() {
  const permissions = usePermissions();
  const { state } = useLocation();
  const navigate = useNavigate();
  const userId = state?.userId;

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [celular, setCelular] = useState("");
  const [login, setLogin] = useState("Ativo");
  const [email, setEmail] = useState("");
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [roles, setRoles] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isCelularValid, setIsCelularValid] = useState(true);

  useEffect(() => {
    const loadRoles = async () => {
      try {
        const roles = await getRoles();
        setRoles(roles);
      } catch (error) {
        console.error("Erro ao carregar roles:", error);
      }
    };
    loadRoles();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
        try {
          const user = await getLoggedUser();
          if (user) {
            setNomeCompleto(user.name || "");
            setCelular(mascaraTelefone(user.phone || ""));
            setLogin(user.status ? "Ativo" : "Inativo");
            setEmail(user.email || "");
            setPerfilSelecionado(user.role._id || "");
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
        }
    };

    fetchUser();
  }, [userId]);

  const handleDelete = async () => {
    setShowDeleteModal(false);
    if (userId) {
      try {
        await deleteUserById(userId);
        setShowDeletedModal(true);
      } catch (error) {
        console.error("Erro ao deletar usuário:", error);
      }
    }
  };

  const handleSave = async () => {
    const trimmedCelular = celular.replace(/\D/g, "");
    const { isValid: isValidNumber, message: celularMessage } =
      isValidCelular(trimmedCelular);
    const { isValid: isValidEmailAddress, message: emailMessage } =
      isValidEmail(email);

    setIsCelularValid(isValidNumber);
    setIsEmailValid(isValidEmailAddress);

    if (!isValidNumber || !isValidEmailAddress) {
      if (!isValidNumber) {
        console.error(celularMessage);
      }
      if (!isValidEmailAddress) {
        console.error(emailMessage);
      }
      return;
    }

    const updatedUser = {
      name: nomeCompleto,
      email: email,
      phone: trimmedCelular,
      status: login === "Ativo",
      role: perfilSelecionado,
    };
    try {
      await updateLogged(updatedUser);
      handleSaveModal();
    } catch (error) {
      console.error(`Erro ao atualizar usuário com ID ${userId}:`, error);
    }
  };

  const handleChangeLogin = (event) => setLogin(event.target.value);
  const handlePerfilChange = (event) =>
    setPerfilSelecionado(event.target.value);

  const handleSaveModal = () => setShowSaveModal(true);
  const handleSaveCloseDialog = () => {
    setShowSaveModal(false);
    navigate("/user");
  };
  const handleDeleteCloseDialog = () => setShowDeleteModal(false);
  const handleDeletedCloseDialog = () => {
    setShowDeletedModal(false);
    navigate("/usuarios");
  };

  return (
    <section className="container">
      <div className="forms-container-user">
        <h1>Visualização de usuário</h1>
        <h3>Dados Pessoais</h3>
        <FieldText
          label="Nome Completo"
          value={nomeCompleto}
          onChange={(e) =>
            setNomeCompleto(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))
          }
        />
        <div className="double-box-user">
          <FieldText
            label="Celular"
            value={celular}
            onChange={(e) => setCelular(mascaraTelefone(e.target.value))}
          />
          <FieldSelect
            label="Status"
            value={login}
            onChange={handleChangeLogin}
            options={["Ativo", "Inativo"]}
          />
        </div>
        {!isCelularValid && (
          <label className="isValid">
            *Verifique se o número de celular inserido está completo
          </label>
        )}
        <FieldText
          label="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {!isEmailValid && (
          <label className="isValid">*Insira um email válido</label>
        )}
    
        <div className="double-buttons-user">
          <PrimaryButton text="Salvar" onClick={handleSave} />
        </div>

        <Modal alertTitle="Alterações Salvas" show={showSaveModal}>
          <SecondaryButton
            text="OK"
            onClick={handleSaveCloseDialog}
            width="338px"
          />
        </Modal>
        <Modal
          alertTitle="Deseja deletar o usuário do sistema?"
          show={showDeleteModal}
        >
          <SecondaryButton
            text="EXCLUIR USUÁRIO"
            onClick={handleDelete}
            width="338px"
          />
          <SecondaryButton
            key={"modalButtons"}
            text="CANCELAR E MANTER O CADASTRO"
            onClick={handleDeleteCloseDialog}
            width="338px"
          />
        </Modal>
        <Modal alertTitle="Usuário Deletado" show={showDeletedModal}>
          <SecondaryButton
            key={"okButtons"}
            text="OK"
            onClick={handleDeletedCloseDialog}
            width="338px"
          />
        </Modal>
      </div>
    </section>
  );
}
