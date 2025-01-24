import React, { useState } from "react";
import PrimaryButton from "../../../Components/PrimaryButton";
import ClientInformationModal from "../../../Components/ClientInformationModal";
import CancelInformationModal from "../../../Components/CancelInformationModal";
import CanceledModal from "../../../Components/CanceledModal";
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
        { name: "joao", previousStatus: "Desfiliado", currentStatus: "Quitado", cpf: "123.456.789-00" },
        { name: "gabriel flores", previousStatus: "Quitado", currentStatus: "Desfiliado", cpf: "987.654.321-00" },
        { name: "tiago e ana casal do ano", previousStatus: "Pendente", currentStatus: "Quitado", cpf: "456.789.123-00" },
        { name: "yza", previousStatus: "Quitado", currentStatus: "Pendente", cpf: "321.654.987-00" },
    ]);

    const [clientModalVisible, setClientModalVisible] = useState(false);
    const [cancelModalVisible, setCancelModalVisible] = useState(false);
    const [canceledModalVisible, setCanceledModalVisible] = useState(false);
    const [selectedTransaction, setSelectedTransaction] = useState(null);

    const openClientModal = (transaction) => {
        setSelectedTransaction(transaction);
        setClientModalVisible(true);
    };

    const closeClientModal = () => {
        setClientModalVisible(false);
        setSelectedTransaction(null);
    };

    const openCancelModal = () => {
        setClientModalVisible(false);
        setCancelModalVisible(true);
    };

    const closeCancelModal = () => {
        setCancelModalVisible(false);
    };

    const openCanceledModal = () => {
        setCancelModalVisible(false);
        setCanceledModalVisible(true);
    };

    const closeCanceledModal = () => {
        setCanceledModalVisible(false);
    };

    const pendingTransactions = transactions.filter(transaction => transaction.currentStatus === "Pendente");
    const otherTransactions = transactions.filter(transaction => transaction.currentStatus !== "Pendente");

    return (
        <div className="data-import">
            <h1>Relatório de Atualizações</h1>
            <DataTable transactions={pendingTransactions} openModal={openClientModal} />
            <DataTable transactions={otherTransactions} openModal={openClientModal} />

            {clientModalVisible && (
                <ClientInformationModal
                    transaction={selectedTransaction}
                    onClose={closeClientModal}
                    onDesfiliar={openCancelModal}
                />
            )}

            {cancelModalVisible && (
                <CancelInformationModal
                    onClose={closeCancelModal}
                    onConfirm={openCanceledModal}
                />
            )}

            {canceledModalVisible && (
                <CanceledModal
                    onClose={closeCanceledModal}
                />
            )}

            <div className="button-container">
                <PrimaryButton text="IMPORTAR ARQUIVO" className="central-button" />   
            </div>
        </div>
    );
};

export default DataImport;