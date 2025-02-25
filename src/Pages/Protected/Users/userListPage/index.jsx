// src/pages/UserListPage/UserListPage.js

import Divider from "@mui/material/Divider";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import FieldText from "../../../../Components/FieldText";
import PrimaryButton from "../../../../Components/PrimaryButton";
import "../userHubPage/index.css";
import "./index.css";
import { getUsers } from "../../../../Services/userService";
import { usePermissions, checkAction } from "../../../../Utils/permission";

export default function UserListPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const permissions = usePermissions();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getUsers();
        if (Array.isArray(response)) {
          setUsers(response);
        } else {
          console.error("Os dados recebidos não são um array.");
        }
      } catch (error) {
        console.error("Erro ao buscar usuários:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setLoading(false);
  }, [permissions]);

  if (loading) {
    // Renderizar um spinner ou algum placeholder enquanto as permissões estão sendo carregadas
    return <div>Carregando...</div>;
  }

  const hasPermission = checkAction("usuarios_criar");

  const handleRegisterClick = () => {
    navigate("/usuarios/criar");
  };

  const handleItemClick = (user) => {
    if (user?.role?.name === "sindicalizado") {
      navigate(`/filiados/${user.name}`, {
        state: { membershipId: user._id },
      });
    } else {
      navigate(`/usuarios/editar/${user.name}`, {
        state: { userId: user._id },
      });
    }
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="container-userlist">
      <div className="forms-container-userlist">
        <div className="double-box-userlist">
          <h1>Lista de Usuários</h1>
          <br />
          {hasPermission && (
            <PrimaryButton
              text="Cadastrar Usuário"
              onClick={handleRegisterClick}
            />
          )}
          {hasPermission && (
            <PrimaryButton
              text="Cadastrar Sindicalizado"
              onClick={() => {
                navigate("/filiacao");
              }}
            />
          )}
        </div>
        <FieldText
          label="Pesquisar Usuário"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <List>
          {filteredUsers.map((user, index) => (
            <div key={user._id}>
              <ListItem>
                <ListItemButton
                  className="list-item-userlist"
                  onClick={() => handleItemClick(user)}
                >
                  <ListItemText primary={user.name} />
                </ListItemButton>
              </ListItem>
              {index < filteredUsers.length - 1 && <Divider />}
            </div>
          ))}
        </List>
      </div>
    </section>
  );
}
