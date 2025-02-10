import "./index.css";
//import PropTypes from "prop-types";
import { AiOutlineMenu } from "react-icons/ai";
import sindpol_logo from "../../assets/sindpol-logo.png";
import sentinela_logo from "../../assets/sentinela-logo.png";
import { ButtonGroup } from "@mui/material";
import { useEffect, useContext, useState } from "react";
import SideButton from "../SideButton";
import { AiOutlineUser } from "react-icons/ai";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import AuthContext, { useAuth } from "../../Context/auth";
import { checkAction } from "../../Utils/permission";
import { getRoleById } from "../../Services/RoleService/roleService";

export default function SideBar() {
  const [isSideBarOpen, setIsSideBarOpen] = useState(false);
  const handleSideBar = () => setIsSideBarOpen(!isSideBarOpen);
  const navigate = useNavigate();
  const context = useContext(AuthContext);
  const { user } = useAuth();
  const [role, setRole] = useState("");

  useEffect(() => {}, [navigate]);

  const handleItemClick = async (user) => {
    if (user) {
      try {
        const result = await getRoleById(user.role);
        setRole(result.name);
      } catch (error) {
        console.error(error);
      }
    }

    if (role == "administrador") {
      navigate(`/usuarios/editar/${user.name}`, {
        state: { userId: user._id },
      });
    } else {
      navigate("/user");
    }
  };

  return (
    <>
      <div className="hidden-menu">
        <AiOutlineMenu onClick={() => handleSideBar()} />
      </div>
      <div
        className={`side-bar ${isSideBarOpen ? "open" : ""}`}
        style={
          {
            //height: fullHeight ? "100vh" : "100%",
          }
        }
      >
        <img className="logo" src={sindpol_logo} alt="Sindpol Logo" />
        <img className="sentinela" src={sentinela_logo} alt="Sentinela Logo" />
        <div className="menu-lateral">
          <ButtonGroup
            orientation="vertical"
            aria-label="Vertical button group"
            variant="text"
            sx={{
              width: "380px",
              "& .MuiButton-root": {
                color: "#3D160D", // Cor do texto dos botões
                borderColor: "#3D160D", // Cor da borda dos botões
              },
            }}
          >
            <SideButton
              hidden={user ? "flex" : "none"}
              key="home"
              text="PÁGINA INICIAL"
              onClick={() => {
                navigate("/home");
                setIsSideBarOpen(false);
              }}
            />
            {(checkAction("filiados_cadastrar") ||
              checkAction("usuarios_visualizar") ||
              checkAction("perfis_visualizar") ||
              checkAction("filiados_cadastrar") ||
              checkAction("orgaos_visualizar") ||
              checkAction("associados_visualizar")) && (
              <SideButton
                key="filiacao"
                text="CADASTROS"
                onClick={() => {
                  navigate("/usuarios/hub");
                  setIsSideBarOpen(false);
                }}
              />
            )}

            {(checkAction("filiados_cadastrar") ||
              checkAction("beneficios_criar") ||
              checkAction("beneficios_visualizar") ||
              checkAction("beneficios_editar")) && (
              <SideButton
                key="financeiro"
                text="FINANCEIRO"
                onClick={() => {
                  navigate("/finance/hub");
                  setIsSideBarOpen(false);
                }}
              />
            )}

            {(checkAction("patrimonio_criar") ||
              checkAction("patrimonio_deletar") ||
              checkAction("patrimonio_visualizar") ||
              checkAction("patrimonio_editar")) && (
              <SideButton
                // hidden={checkModule(permissions, "finance") ? "flex" : "none"}
                key="patrimonios"
                text="PATRIMÔNIO"
                onClick={() => {
                  navigate("/patrimonio/hub");
                  setIsSideBarOpen(false);
                }}
              />
            )}
            {(checkAction("beneficios_visualizar") ||
              checkAction("beneficios_criar") ||
              checkAction("beneficios_editar")) && (
              <SideButton
                key="beneficios"
                text="BENEFÍCIOS"
                onClick={() => {
                  navigate("/beneficios");
                  setIsSideBarOpen(false);
                }}
              />
            )}
            <SideButton
              hidden={user ? "none" : "flex"}
              key="login"
              text="LOGIN"
              onClick={() => {
                navigate("/");
                setIsSideBarOpen(false);
              }}
            />
            {checkAction("filiados_cadastrar") && (
              <SideButton
                key="filiacão"
                text="FILIAÇÃO"
                onClick={() => {
                  navigate("/filiacao");
                  setIsSideBarOpen(false);
                }}
              />
            )}
            {checkAction("filiado_visualizar_carteirinha") && (
              <SideButton
                key="carteirinha"
                text="CARTEIRINHA"
                onClick={() => {
                  navigate("/carteirinha");
                  setIsSideBarOpen(false);
                }}
              />
            )}
            {checkAction("sindicalizado_visualizar_status") && (
              <SideButton
                key="Verificarsindicalizado"
                text="VERIFICAR SINDICALIZADO"
                onClick={() => {
                  navigate("/verificar-membro");
                  setIsSideBarOpen(false);
                }}
              />
            )}
          </ButtonGroup>
        </div>
        <div
          style={{
            display: user ? "flex" : "none",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            height: "100%",
            gap: "1rem",
          }}
        >
          <AiOutlineUser
            style={{
              fontSize: "50px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleItemClick(user);
              setIsSideBarOpen(false);
            }}
          />
          <h2
            style={{
              fontWeight: "600",
              fontSize: "medium",
              textAlign: "center",
            }}
          >
            Você está logado como {user?.name}
          </h2>
          <ButtonGroup>
            <button
              key="logout"
              className="btn-logout"
              onClick={() => {
                context.Logout();
                navigate("/");
                window.location.reload();
              }}
              style={{
                cursor: "pointer",
              }}
            >
              LOGOUT <RiLogoutCircleRLine className="logout-icon" />
            </button>
          </ButtonGroup>
        </div>
      </div>
    </>
  );
}
/*
SideBar.propTypes = {
  fullHeight: PropTypes.bool,
};
*/
