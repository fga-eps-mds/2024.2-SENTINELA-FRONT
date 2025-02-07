import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Context/auth";
import SecondaryButton from "../../../../Components/SecondaryButton";
import sindpolLogo from "../../../../assets/sindpol-logo.png";
import sentinelaLogo from "../../../../assets/sentinela-logo.png";
import "./index.css";
import { checkAction } from "../../../../Utils/permission";

export default function Patrimonio() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleListaClick = () => {
    navigate("/patrimonio/list");
  };

  return (
    user && (
      <section className="containerFinance">
        <div className="area-card">
          <div className="card">
            <img className="logo" src={sindpolLogo} alt="Sindpol Logo" />
            <img
              className="sentinela"
              src={sentinelaLogo}
              alt="Sentinela Logo"
            />

            {(checkAction("patrimonio_criar") ||
              checkAction("patrimonio_editar") ||
              checkAction("patrimonio_deletar") ||
              checkAction("patrimonio_visualizar")) && (
              <SecondaryButton
                text="Lista de Patrimônios"
                onClick={handleListaClick}
              />
            )}
          </div>
        </div>
      </section>
    )
  );
}