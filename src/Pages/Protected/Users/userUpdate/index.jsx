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
  updateLogged,
  changePasswordInProfile,
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
  const [showPasswords, setShowPasswords] = useState(false);

  const [nomeCompleto, setNomeCompleto] = useState("");
  const [celular, setCelular] = useState("");
  const [login, setLogin] = useState("Ativo");
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmNewPassword] = useState("");
  
  const [perfilSelecionado, setPerfilSelecionado] = useState("");
  const [roles, setRoles] = useState([]);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showPasswordSaveModal, setShowPasswordSaveModal] = useState(false);
  const [isEmailValid, setIsEmailValid] = useState(true);
  const [isCelularValid, setIsCelularValid] = useState(true);
  const [isUserVisible, setIsUserVisible] = useState(true);
  const [isNewPasswordValid, setIsNewPasswordValid] = useState(true);

  const storagedUserString = localStorage.getItem("@App:user");
  const storagedUser = JSON.parse(storagedUserString);
  const passwordsMatch = newPassword === confirmPassword;

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

  console.log(userId);

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

  const handleSavePassword = async () => {
   
    const updatedUserPassword = {
      old_password: oldPassword,
      new_password: newPassword,
    };
    try {
      await changePasswordInProfile(updatedUserPassword).then(
        (data) => {
          console.log('caraleo', data)
          if(data && data.response.status != 200){
            alert(data.response.data.mensagem)
          }
          
        }
      )  
      handleSavePasswordModal();
    } catch (error) {
      console.error(`Erro ao atualizar senha do usuário com ID ${userId}:`, error);
    }
  };

  const handleChangeLogin = (event) => setLogin(event.target.value);
  const handlePerfilChange = (event) =>
    setPerfilSelecionado(event.target.value);

  const handleSaveModal = () => setShowSaveModal(true);
  const handleSavePasswordModal = () => setShowPasswordSaveModal(true);

  const handleSaveCloseDialog = () => {
    setShowSaveModal(false);
    setShowPasswordSaveModal(false);
    navigate("/user");
  };

  const showUserDiv = () => setIsUserVisible(true);
  const showPasswordDiv = () => setIsUserVisible(false);

  return (
    <section className="container">
      <div className="forms-container-user">
        <div className="double-buttons-user">
          <PrimaryButton text="Editar usuário" onClick={showUserDiv} />  
          <PrimaryButton text="Editar senha" onClick={showPasswordDiv}/>
        </div>
        
        {isUserVisible && (
        <div>
          <h3>Dados Pessoais</h3>
          <div className="double-box-user">
            <FieldText
              label="Nome Completo"
              value={nomeCompleto}
              onChange={(e) =>
                setNomeCompleto(e.target.value.replace(/[^a-zA-ZÀ-ÿ\s]/g, ""))
              }
            />
            <FieldText
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {!isEmailValid && (
              <label className="isValid">*Insira um email válido</label>
            )}
          </div>
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
          
          
          <PrimaryButton text="Salvar" onClick={handleSave} />
          
          <Modal alertTitle="Alterações Salvas" show={showSaveModal}>
            <SecondaryButton
              text="OK"
              onClick={handleSaveCloseDialog}
              width="338px"
            />
          </Modal>

        </div>
        )}
        
        {!isUserVisible && (
          <div>
            <h3>Alterar Senha</h3>
            <FieldText
              label="Senha atual"
              type={showPasswords ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
                  
            <FieldText
              label="Nova senha"
              value={newPassword}
              type={showPasswords ? "text" : "password"}
              onChange={(e) => setNewPassword(e.target.value)}
            />
              {!isNewPasswordValid && (
                <label className="isValid">*Insira uma senha válida</label>
              )}

            <FieldText
              label="Repetir nova senha"
              type={showPasswords ? "text" : "password"}
              onChange={(e) => setConfirmNewPassword(e.target.value)}
            />

            <br />
            {!passwordsMatch && confirmPassword && (
              <span style={{ color: "red" }}>As senhas não coincidem</span>
            )}           
            <br />


            <PrimaryButton text="Alterar senha" onClick={handleSavePassword} />

            <Modal alertTitle="Alterações Salvas" show={showPasswordSaveModal}>
            <SecondaryButton
              text="OK"
              onClick={handleSaveCloseDialog}
              width="338px"
            />
            </Modal>

          </div>
        )}
      </div>
    </section>
  );
}
