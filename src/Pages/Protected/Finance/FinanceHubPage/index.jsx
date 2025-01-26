import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../../Context/auth";
import SecondaryButton from "../../../../Components/SecondaryButton";
import sindpolLogo from "../../../../assets/sindpol-logo.png";
import sentinelaLogo from "../../../../assets/sentinela-logo.png";
import "./index.css";
import { checkAction } from "../../../../Utils/permission";

export default function Finance() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleFornecedoresListaClick = () => {
    navigate("/fornecedores");
  };

  const handleListaClick = () => {
    navigate("/finance/list");
  };

  const handleMovimentacoesClick = () => {
    navigate("/movimentacoes/lista");
  };

  const handleGeradorRelatorio = () => {
    navigate("/movimentacoes/relatorio");
  };

  const handleImportarExtrato = () => {
    navigate("/dataimport");
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

            {(checkAction("fornecedores_criar") ||
              checkAction("fornecedores_editar") ||
              checkAction("fornecedores_deletar") ||
              checkAction("fornecedores_visualizar")) && (
              <SecondaryButton
                text="Lista de Fornecedores"
                onClick={handleFornecedoresListaClick}
              />
            )}
            {(checkAction("contas_bancarias_criar") ||
              checkAction("contas_bancarias_editar") ||
              checkAction("contas_bancarias_deletar") ||
              checkAction("contas_bancarias_visualizar")) && (
              <SecondaryButton
                text="Lista de Contas Bancárias"
                onClick={handleListaClick}
              />
            )}
            {(checkAction("movimentacao_financeira_criar") ||
              checkAction("movimentacao_financeira_editar") ||
              checkAction("movimentacao_financeira_deletar") ||
              checkAction("movimentacao_financeira_visualizar")) && (
              <SecondaryButton
                text="Lista de Movimentações Financeiras"
                onClick={handleMovimentacoesClick}
              />
            )}
            {checkAction("movimentacao_financeira_visualizar") && (
              <SecondaryButton
                text="Gerar relatório"
                onClick={handleGeradorRelatorio}
              />
            )}
            {(checkAction("movimentacao_financeira_criar") ||
              checkAction("movimentacao_financeira_editar") ||
              checkAction("movimentacao_financeira_deletar") ||
              checkAction("movimentacao_financeira_visualizar")) && (
              <SecondaryButton
                text="Extrato Bancário"
                onClick={handleImportarExtrato}
              />
            )}
          </div>
        </div>
      </section>
    )
  );
}
