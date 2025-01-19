// src/pages/UserHubPage/UserHubPage.js

import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../../../Components/SecondaryButton";
import sindpol_logo from "../../../../assets/sindpol-logo.png";
import sentinela_logo from "../../../../assets/sentinela-logo.png";
import "./index.css";
import { checkAction } from "../../../../Utils/permission";

export default function UserHubPage() {
  const navigate = useNavigate();

  const handleListaClick = () => {
    navigate("/usuarios");
  };

  const handleListaPerfilClick = () => {
    navigate("/perfis");
  };
  const handleListaPermissiosnClick = () => {
    navigate("/permissions");
  };

  const handleListaOrgaosClick = () => {
    navigate("/organ/list");
  };

  return (
    <section className="container">
      <div className="area-card">
        <div className="card">
          <img className="logo" src={sindpol_logo} alt="Sindpol Logo" />
          <img
            className="sentinela"
            src={sentinela_logo}
            alt="Sentinela Logo"
          />
          {(checkAction("usuarios_visualizar") ||
            checkAction("usuarios_editar")) && (
            <SecondaryButton
              text="Filiações pendentes"
              onClick={() => navigate("filiacoes-pendentes/")}
            />
          )}
          <>
            {(checkAction("usuarios_criar") ||
              checkAction("usuarios_visualizar") ||
              checkAction("usuarios_editar") ||
              checkAction("usuarios_deletar")) && (
              <SecondaryButton
                text="LISTA DE USUÁRIOS"
                onClick={handleListaClick}
              />
            )}
            {(checkAction("perfis_criar") ||
              checkAction("perfis_visualizar") ||
              checkAction("perfis_editar") ||
              checkAction("perfis_deletar")) && (
              <SecondaryButton
                text="LISTA DE PERFIL"
                onClick={handleListaPerfilClick}
              />
            )}
            {(checkAction("perfis_criar") ||
              checkAction("perfis_visualizar") ||
              checkAction("perfis_editar") ||
              checkAction("perfis_deletar")) && (
              <SecondaryButton
                text="PERMISSÕES"
                onClick={handleListaPermissiosnClick}
              />
            )}

            {(checkAction("orgaos_criar") ||
              checkAction("orgaos_visualizar") ||
              checkAction("orgaos_editar") ||
              checkAction("orgaos_deletar")) && (
              <SecondaryButton
                text="LISTA DE ÓRGÃOS"
                onClick={handleListaOrgaosClick}
              />
            )}
          </>
        </div>
      </div>
    </section>
  );
}
