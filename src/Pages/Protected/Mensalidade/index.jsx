import React, { useState } from "react";
import "./index.css";

const DataTable = ({ transactions, openModal }) => {
    const getStatusClass = (status) => {
        switch (status.toLowerCase()) {
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
                        <th>Status Anterior</th>
                        <th>Status Atual</th>
                        <th></th> {/* Nova coluna para o ícone */}
                    </tr>
                </thead>
                <tbody>
                    {transactions.length === 0 ? (
                        <tr>
                            <td colSpan="4">Nenhum dado encontrado.</td>
                        </tr>
                    ) : (
                        transactions.map((item, index) => (
                            <tr key={index} className={getStatusClass(item.currentStatus)}>
                                <td className="name-column">{item.name}</td>
                                <td>{item.previousStatus}</td>
                                <td>{item.currentStatus}</td>
                                <td className="icon-cell">
                                    <span className="icon-button" onClick={() => openModal(item)}>
                                        &#x1F50D; {/* Ícone (lupa) */}
                                    </span>
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

const DataImport = () => {
    const [transactions, setTransactions] = useState([
        { name: "John Doe", previousStatus: "Desfiliado", currentStatus: "Quitado" },
        { name: "Jane Smith", previousStatus: "Quitado", currentStatus: "Desfiliado" },
        { name: "Alice Johnson", previousStatus: "Pendente", currentStatus: "Quitado" },
        { name: "Bob Brown", previousStatus: "Quitado", currentStatus: "Pendente" },
    ]);

    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const openModal = (transaction) => {
        setSelectedTransaction(transaction);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
        setSelectedTransaction(null);
    };

    const pendingTransactions = transactions.filter(transaction => transaction.currentStatus === "Pendente");
    const otherTransactions = transactions.filter(transaction => transaction.currentStatus !== "Pendente");

    return (
        <div className="data-import">
            <h1>Relatório de Atualizações</h1>
            <DataTable transactions={pendingTransactions} openModal={openModal} />
            <DataTable transactions={otherTransactions} openModal={openModal} />

            {modalVisible && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={closeModal}>&times;</span>
                        <h2>Detalhes da Transação</h2>
                        {selectedTransaction && (
                            <div>
                                <p><strong>Nome:</strong> {selectedTransaction.name}</p>
                                <p><strong>Status Anterior:</strong> {selectedTransaction.previousStatus}</p>
                                <p><strong>Status Atual:</strong> {selectedTransaction.currentStatus}</p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <div className="button-container">
                <button className="central-button">IMPORTAR ARQUIVOS CSV</button>
            </div>
        </div>
    );
};

export default DataImport;
