import { useState, useEffect } from "react";
import "../RolesCreatePage/index.css";
import FieldText from "../../../../Components/FieldText";
import PrimaryButton from "../../../../Components/PrimaryButton";
import SecondaryButton from "../../../../Components/SecondaryButton";
import Modal from "../../../../Components/Modal";
import { useNavigate, useLocation } from "react-router-dom";
import {
  getRoleById,
  updateRole,
  deleteRole,
  assignPermissionsToRole,
} from "../../../../Services/RoleService/roleService";
import {
  getAllPermissions,
  searchPermissionByName,
} from "../../../../Services/Permissions/permissionsService"; 
import './index.css';

export default function RolesUpdatePage() {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showSuccessDelModal, setShowSuccessDelModal] = useState(false);
  const [profileName, setProfileName] = useState("");
  
  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [permissionsList, setPermissionsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [allPermissions, setAllPermissions] = useState([]); 

  const navigate = useNavigate();
  const location = useLocation();
  const { roleId } = location.state;

  // Função para buscar todas as permissões
  const fetchAllPermissions = async () => {
    try {
      const permissions = await getAllPermissions();
      setAllPermissions(permissions);
      setPermissionsList(permissions); // Inicializa a lista de permissões com todas
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
    }
  };

  // Função para realizar a pesquisa de permissões
  const handleSearch = async (query) => {
    setSearchQuery(query);
    try {
      if (query) {
        const permissions = await searchPermissionByName(query);
        setPermissionsList(permissions);
      } else {
        setPermissionsList(allPermissions); // Se a pesquisa estiver vazia, mostra todas as permissões
      }
    } catch (error) {
      console.error("Erro ao buscar permissões:", error);
    }
  };

  useEffect(() => {
    const fetchRole = async () => {
      try {
        const roleData = await getRoleById(roleId);
        setProfileName(roleData.name);

        
        const rolePermissions = roleData.permissions.map((perm) => perm._id);
        setSelectedPermissions(rolePermissions);
        console.log('cu', )
      } catch (error) {
        console.error("Erro ao buscar o perfil:", error);
      }
    };

    fetchRole();
    fetchAllPermissions(); // Chama a função para buscar todas as permissões
  }, [roleId]);

  const handleSubmit = async () => {
    try {
      const updatedRole = {
        name: profileName,
        permissions: selectedPermissions.map((perm) => ({
          module: perm,
          access: ["create", "read", "update", "delete"],
        })),
      };

     // await updateRole(roleId, updatedRole);
      await assignPermissionsToRole(roleId, selectedPermissions.filter((item) => item !== undefined));
      setShowSuccessModal(true);
    } catch (error) {
      console.error("Erro ao atualizar o perfil:", error);
    }
  };

  const handleDeleteRole = async () => {
    try {
      await deleteRole(roleId);
      setShowSuccessDelModal(true);
    } catch (error) {
      console.error("Erro ao deletar o perfil:", error);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    setShowSuccessDelModal(false);
    navigate("/perfis");
  };

  const handleSelectAll = () => {
    setSelectedPermissions(permissionsList.map((perm) => perm._id)); // Seleciona todas as permissões da lista
  };

  const handleDeselectAll = () => {
    setSelectedPermissions([]);
  };

  const handleTogglePermission = (permission) => {
    setSelectedPermissions((prev) => {
      return prev.includes(permission)
        ? prev.filter((p) => p !== permission && p != undefined)
        : [...prev, permission]

    }
    );
  };

  return (
    <section className="container">
      <div className="forms-container">
        <h1>Atualização de Perfil</h1>
        <h3>Informações do Perfil</h3>

        <FieldText
          label="Nome do Perfil"
          value={profileName}
          onChange={(e) => setProfileName(e.target.value)}
        />
        {!(profileName.length > 0) && (
          <label className="invalid">Nome é um campo obrigatório!</label>
        )}

        {/* Campo de pesquisa para permissões */}
        {/* <div className="permission-search-box">
          <h3>Pesquisar Permissões</h3>
          <FieldText
            label="Pesquisar Permissão"
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            placeholder="Digite o nome da permissão"
          />
        </div> */}

        {/* Lista de permissões */}
        <div className="permission-list-box">
          <h3>Lista de Permissões</h3>
          <div className="permissions-list">
            {permissionsList.map((permission) => (
              <div key={permission._id} className="permission-item">
                <label className="permission-label">
                  <input
                    type="checkbox"
                    className="permission-checkbox"
                    checked={selectedPermissions.includes(permission._id)}
                    onChange={() => handleTogglePermission(permission._id)}
                  />
                  {permission.name}
                  {selectedPermissions.name}
                </label>
              </div>
            ))}
          </div>
        </div>

        <div className="double-buttons-roles">
          <SecondaryButton
            text="DELETAR"
            onClick={() => setShowDeleteModal(true)}
          />
          <PrimaryButton
            text="SALVAR"
            onClick={() => setShowSaveModal(true)}
          />
        


          {/* Modais */}
          <Modal
            alertTitle="Confirmação de exclusão"
            width="338px"
            alert="Deseja excluir este perfil? Usuários que os possuem perderão suas permissões!"
            show={showDeleteModal}
          >
            <SecondaryButton
              key="confirmar"
              text="Confirmar"
              onClick={handleDeleteRole}
              width="338px"
            />
            <SecondaryButton
              key="cancelar"
              text="Cancelar"
              onClick={() => setShowDeleteModal(false)}
              width="338px"
            />
          </Modal>

          <Modal
            alertTitle="Confirmação"
            width="338px"
            alert="Deseja continuar com as alterações feitas no perfil?"
            show={showSaveModal}
          >
            <SecondaryButton
              key="confirmar2"
              text="Confirmar"
              onClick={handleSubmit}
              width="338px"
            />
            <SecondaryButton
              key="cancelar2"
              text="Cancelar"
              onClick={() => setShowSaveModal(false)}
              width="338px"
            />
          </Modal>

          <Modal
            alertTitle="Sucesso"
            width="338px"
            alert="Perfil atualizado com sucesso!"
            show={showSuccessModal}
          >
            <SecondaryButton
              key="ok"
              text="Ok"
              onClick={handleCloseSuccessModal}
              width="338px"
            />
          </Modal>

          <Modal
            alertTitle="Sucesso"
            width="338px"
            alert="Perfil deletado com sucesso!"
            show={showSuccessDelModal}
          >
            <SecondaryButton
              key="ok"
              text="Ok"
              onClick={handleCloseSuccessModal}
              width="338px"
            />
          </Modal>
        </div>
      </div>
    </section>
  );
}
