import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, FormControlLabel, Radio, RadioGroup } from "@mui/material";
import FieldSelect from "../../../../Components/FieldSelect";
import FieldText from "../../../../Components/FieldText";
import Modal from "../../../../Components/Modal";
import PrimaryButton from "../../../../Components/PrimaryButton";
import SecondaryButton from "../../../../Components/SecondaryButton";
import {
  deleteUserById,
  getRoles,
  getUserById,
  patchUserById,
} from "../../../../Services/userService";
import { checkAction } from "../../../../Utils/permission";
import "./index.css";
import {
  isValidCelular,
  isValidEmail,
  mascaraTelefone,
} from "../../../../Utils/validators";

export default function UserUpdatePage() {
  // const permissions = usePermissions();
  const { state } = useLocation();
  const navigate = useNavigate();
  const userId = state?.userId;

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [celular, setCelular] = useState("");
  const [situation, setSituation] = useState("");
  const [login, setLogin] = useState("Ativo");
  const [email, setEmail] = useState("");
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [roles, setRoles] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeletedModal, setShowDeletedModal] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isCelularValid, setIsCelularValid] = useState(true);

  const canDelete = checkAction("usuarios_deletar");
  const canUpdate = checkAction("usuarios_editar");

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
      if (userId) {
        try {
          const user = await getUserById(userId);
          if (user) {
            setNomeCompleto(user.name || "");
            setCelular(mascaraTelefone(user.phone || ""));
            setSituation(user.situation || "Pendente");
            setLogin(user.status ? "Ativo" : "Inativo");
            setEmail(user.email || "");
            setPerfilSelecionado(user.role._id || "");
          }
        } catch (error) {
          console.error("Erro ao buscar usuário:", error);
        }
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

    if (userId) {
      const updatedUser = {
        name: nomeCompleto,
        email: email,
        phone: trimmedCelular,
        situation: situation,
        status: login === "Ativo",
        role: perfilSelecionado,
      };
      try {
        await patchUserById(userId, updatedUser);
        handleSaveModal();
      } catch (error) {
        console.error(`Erro ao atualizar usuário com ID ${userId}:`, error);
      }
    }
  };

  const handlePerfilChange = (event) =>
    setPerfilSelecionado(event.target.value);

  const handleSaveModal = () => setShowSaveModal(true);
  const handleDeleteModal = () => setShowDeleteModal(true);
  const handleSaveCloseDialog = () => {
    setShowSaveModal(false);
    navigate("/usuarios");
  };
  const handleDeleteCloseDialog = () => setShowDeleteModal(false);
  const handleDeletedCloseDialog = () => {
    setShowDeletedModal(false);
    navigate("/usuarios");
  };

  const handleNavigateToContributions = () => {
    navigate(`/movimentacoes/contribuicoes/${nomeCompleto}`, {
      state: {
        userId,
        nomeCompleto,
        celular,
        email,
        situation,
        login,
        perfilSelecionado,
      },
    });
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
            value={situation}
            onChange={(e) => setSituation(e.target.value)}
            options={["Quitado", "Pendente", "Desfiliado"]}
          />
          {/* <FieldSelect
            label="Sttus"
            value={login}
            onChange={handleChangeLogin}
            options={["Ativo", "Inativo", "Solteira"]}
          /> */}
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
        <Button
          className="contribution-btn"
          onClick={handleNavigateToContributions}
        >
          Histórico de Contribuições
        </Button>
        <h3>Perfil</h3>
        <RadioGroup
          className="perfil-radiogroup"
          value={perfilSelecionado}
          onChange={handlePerfilChange}
        >
          {roles
            ?.filter((perfil) => perfil?.name !== "sindicalizado")
            .map((perfil) => (
              <FormControlLabel
                key={perfil?.name}
                value={perfil?._id}
                control={<Radio />}
                label={perfil?.name}
              />
            ))}
        </RadioGroup>

        <div className="double-buttons-user">
          {canDelete && (
            <SecondaryButton text="Deletar" onClick={handleDeleteModal} />
          )}
          {canUpdate && <PrimaryButton text="Salvar" onClick={handleSave} />}
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
