import React, { useState, useEffect } from "react";
import ClientInformationModal from "../../../Components/ClientInformationModal";
import CancelInformationModal from "../../../Components/CancelInformationModal";
import CanceledModal from "../../../Components/CanceledModal";
import PayedModal from "../../../Components/PayedModal";
import { readcsv } from "../../../Utils/csvRead";
import { patchUserById, getUsers} from "../../../Services/userService";
import "./index.css";

const TransactionTable = ({ transactions, openModal }) => {
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
                            <tr key={index} className={getSituation(item.currentStatus)}>
                                <td className="name-column">{item.name}</td>
                                <td>{item.previousStatus}</td>
                                <td>{item.currentStatus}</td>
                                <td className="icon-cell">
                                    <span className="icon-button" onClick={() => openModal("clientModalVisible", item)}>
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
    const [transactions, setTransactions] = useState([]);
    const [modals, setModals] = useState({
        clientModalVisible: false,
        cancelModalVisible: false,
        canceledModalVisible: false,
        payedModalVisible: false,
    });

    const [selectedTransaction, setSelectedTransaction] = useState(null);
    const [cancelDate, setCancelDate] = useState("");
    const [justification, setJustification] = useState("");

    useEffect(() => {
        setCancelDate("");
        setJustification("");
    }, [selectedTransaction]);

    const openModal = (modalName, transaction = null) => {
        setSelectedTransaction(transaction);
        console.log("Transação selecionada:", transaction);
        setModals({
            clientModalVisible: false,
            cancelModalVisible: false,
            canceledModalVisible: false,
            payedModalVisible: false,
            [modalName]: true
        });
    };

    const closeModal = (modalName) => {
        setModals((prev) => ({ ...prev, [modalName]: false }));
        if (modalName === "clientModalVisible") setSelectedTransaction(null);
    };

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
    
        if (file) {
            try {
                // Passar o delimitador correto (ponto e vírgula)
                const result = await readcsv(file, ';'); // Passa o delimitador como ponto e vírgula
                console.log("Dados do CSV processados:", result);
    
                // Limpeza do cabeçalho (remover a parte com '***' e renomear as colunas)
                const cleanedResult = result.map(row => {
                    // Limpeza das chaves para garantir que estamos acessando os dados corretamente
                    const cleanRow = {};
    
                    // Exemplo de como você pode limpar as colunas
                    for (const [key, value] of Object.entries(row)) {
                        // Limpeza do nome da chave
                        const cleanedKey = key.replace(/\*\*\*|;/g, "").trim(); // Remove "***" e ponto e vírgula
                        cleanRow[cleanedKey] = value ? value.trim() : ""; // Garantir que o valor esteja limpo
                    }
    
                    return cleanRow;
                });
    
                // Agora podemos mapear os dados de forma mais limpa
                const mappedTransactions = cleanedResult.map(row => {
                    // Acesso às propriedades do CSV já limpas
                    const transaction = {
                        name: row["servidor(nome)"] || "", // Nome do servidor
                        cpf: row["cpf_servidor"] || "", // CPF do servidor
                        previousStatus: row["status_atual_parc"] || "", // Status anterior
                        currentStatus: row["status_parc_holerite"] || "", // Status atual
                    };
    
                    console.log("Transação mapeada:", transaction);
                    return transaction;
                }).filter(item => item.name && item.cpf); // Filtra transações válidas
    
                console.log("Transações finais mapeadas:", mappedTransactions);
                setTransactions(mappedTransactions); // Atualiza o estado com as transações mapeadas
            } catch (error) {
                console.error("Erro ao processar o arquivo CSV:", error);
            }
        }
    };
    
    


    const handleQuitado = async () => {
        if (!selectedTransaction) {
            console.error("Nenhuma transação selecionada");
            return;
        }

        const { cpf, name } = selectedTransaction;

        try {
            const users = await getUsers();
            if (!Array.isArray(users)) {
                console.error("Os dados recebidos não são um array.");
                throw new Error("Os dados recebidos não são um array.");
            }
            console.log("Usuário do sistema:", users);
    
            const user = users.find(user => user.cpf === cpf); // Encontrar o usuário pelo CPF
            if (!user) {
                console.error(`Usuário com CPF ${cpf} não encontrado.`);
                return;
            }

            const updatedUser = {
                situation: "Quitado",
                cancelDate: "",
                justification: "",
            };

            await patchUserById(user._id, updatedUser); // Usando o _id do usuário
            console.log(`Usuário ${name} atualizado para Quitado no banco de dados.`);
                } catch (error) {
            console.error(`Erro ao atualizar o usuário no banco de dados:`, error);
            return;
                }

    
        // Atualizar o estado local após a mudança
        setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
                transaction.cpf === cpf
                    ? { ...transaction, currentStatus: "Quitado" }
                    : transaction
            )
        );
    
        // Fechar o modal de cliente e abrir o modal de pagamento
        closeModal("clientModalVisible");
        openModal("payedModalVisible");
    };
    

    
    const handleDesfiliado = async () => {
        if (!selectedTransaction) {
            console.error("No transaction selected");
            return;
        }
        if (!cancelDate || !justification) {
            console.error("Date and justification are required");
            return;
        }
    
        const { cpf, name } = selectedTransaction;
    
        // Atualizar o banco de dados
        try {
            // Buscar o usuário com base no CPF
            const users = await getUsers();
            if (!Array.isArray(users)) {
                console.error("Os dados recebidos não são um array.");
                throw new Error("Os dados recebidos não são um array.");
            }
    
            const user = users.find(user => user.cpf === cpf); // Encontrar o usuário pelo CPF
            if (!user) {
                console.error(`Usuário com CPF ${cpf} não encontrado.`);
                return;
            }
    
            // Atualizar o usuário com o ID encontrado
            const updatedUser = {
                situation: "Desfiliado",
                cancelDate: cancelDate,
                justification: justification,
            };
            await patchUserById(user._id, updatedUser); // Usando o _id do usuário
            console.log(`Usuário ${name} atualizado para Desfiliado no banco de dados.`);
        } catch (error) {
            console.error(`Erro ao atualizar o usuário no banco de dados:`, error);
            return;
        }
    
        // Atualizar o estado local
        setTransactions((prevTransactions) =>
            prevTransactions.map((transaction) =>
                transaction.cpf === cpf
                    ? { ...transaction, currentStatus: "Desfiliado" }
                    : transaction
            )
        );
    
        // Fechar o modal de cancelamento e abrir o modal de cancelado
        closeModal("cancelModalVisible");
        openModal("canceledModalVisible");
    };

    //filtragem
    const filteredTransactions = transactions.filter(
        (item) => item.previousStatus !== item.currentStatus && item.currentStatus
    );

    const pendingTransactions = filteredTransactions.filter(
        (item) => item.currentStatus && item.currentStatus.toLowerCase() === "pendente"
    );

    const otherTransactions = filteredTransactions.filter(
        (item) => item.currentStatus && item.currentStatus.toLowerCase() !== "pendente"
    );

    return (
        <div className="data-import">
            <h1>Relatório de Atualizações</h1>
            <div className="transactions-container">
            <TransactionTable
                transactions={pendingTransactions}
                openModal={openModal}
            />
            <TransactionTable
                transactions={otherTransactions}
                openModal={openModal}
            />
            <div className="button-container">
                <input
                    type="file"
                    accept=".csv"
                    onChange={handleFileUpload}
                    style={{ display: "none" }}
                    id="file-upload"
                />
                <button className="import-button" onClick={() => document.getElementById('file-upload').click()}>
                    Importar Arquivo CSV
                </button>
                </div>
            </div>

            {modals.clientModalVisible && (
            <>
                <div className="overlay" onClick={() => closeModal("clientModalVisible")}></div>
                <ClientInformationModal
                    transaction={selectedTransaction}
                    onClose={() => closeModal("clientModalVisible")}
                    onDesfiliar={() => openModal("cancelModalVisible", selectedTransaction)}
                    onQuitado={handleQuitado}
                />
            </>
            )}

            {modals.payedModalVisible && (
                <>
                    <div className="overlay" onClick={() => closeModal("payedModalVisible")}></div>
                    <PayedModal
                        onClose={() => closeModal("payedModalVisible")}
                    />
                </>
            )}

            {modals.cancelModalVisible && (
                <>
                    <div className="overlay" onClick={() => closeModal("cancelModalVisible")}></div>
                    <CancelInformationModal
                        onClose={() => {
                            closeModal("cancelModalVisible");
                            openModal("clientModalVisible", selectedTransaction);
                        }}
                        onConfirm={handleDesfiliado}
                        cancelDate={cancelDate}
                        setCancelDate={setCancelDate}
                        justification={justification}
                        setJustification={setJustification}
                    />
                </>
            )}

            {modals.canceledModalVisible && (
                <>
                    <div className="overlay" onClick={() => closeModal("canceledModalVisible")}></div>
                    <CanceledModal
                        onClose={() => closeModal("canceledModalVisible")}
                    />
                </>
            )}
        </div>
    );
};

export default DataImport;