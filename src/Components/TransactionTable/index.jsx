import PropTypes from "prop-types";
import "./index.css";

const TransactionTable = ({ transactions, openModal, isMissing = false }) => {
  const getSituation = (situation) => {
    if (!situation) return "";
    switch (situation.toLowerCase()) {
      case "quitado":
        return "status-quitado";
      case "desfiliado":
        return "status-desfiliado";
      case "pendente":
        return "status-pendente";
      default:
        return "";
    }
  };

  return (
    <div className="table-container">
      <table className="data-table">
        <thead>
          <tr>
            <th className="name-column">Nome</th>
            {isMissing ? (
              <>
                <th>Cpf</th>
                <th>Matricula</th>
              </>
            ) : (
              <>
                <th>Status Anterior</th>
                <th>Status Atual</th>
                {/*<th> </th>  Nova coluna para o ícone */}
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.length === 0 ? (
            <tr>
              <td colSpan="4">Nenhum dado encontrado.</td>
            </tr>
          ) : (
            transactions.map((item, index) => (
              <tr key={index} className={getSituation(item.newSituation)}>
                <td className="name-column">{item.name}</td>
                {isMissing ? (
                  <>
                    <td>{item.cpf_servidor}</td>
                    <td>{item.matricula_servidor}</td>
                  </>
                ) : (
                  <>
                    <td>{item.oldSituation}</td>
                    <td>{item.newSituation}</td>
                    <td className="icon-cell">
                      <span
                        className="icon-button"
                        onClick={() => openModal("clientModalVisible", item)}
                        data-testid="upModal"
                      >
                        &#x1F50D; {/* Ícone (lupa) */}
                      </span>
                    </td>
                  </>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

// Validação das props com PropTypes
TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      cpf_servidor: PropTypes.string,
      matricula_servidor: PropTypes.string,
      oldSituation: PropTypes.string,
      newSituation: PropTypes.string,
    })
  ).isRequired,
  openModal: PropTypes.func.isRequired,
  isMissing: PropTypes.bool,
};

export default TransactionTable;
