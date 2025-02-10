import { useState, useEffect } from "react";
import { readcsv } from "../../../Utils/csvRead";
import { patchUserById, getUsers } from "../../../Services/userService";

import ClientInformationModal from "../../../Components/ClientInformationModal";
import CancelInformationModal from "../../../Components/CancelInformationModal";
import CanceledModal from "../../../Components/CanceledModal";
import PayedModal from "../../../Components/PayedModal";
import TransactionTable from "../../../Components/TransactionTable";

import "./index.css";

const DataImport = () => {
  const [missingUsers, setMissingUsers] = useState([]);
  const [updatedUsers, setUpdatedUsers] = useState([]);
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
      [modalName]: true,
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
        const result = await readcsv(file, ";"); // Passa o delimitador como ponto e vírgula

        setMissingUsers(result.missingUsers);
        setUpdatedUsers(result.updatedUsers);
        console.log("Dados do CSV processados:", result);
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

      const user = users.find((user) => user.cpf === cpf); // Encontrar o usuário pelo CPF
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
    setUpdatedUsers((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.cpf === cpf
          ? { ...transaction, newSituation: "Quitado" }
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

      const user = users.find((user) => user.cpf === cpf); // Encontrar o usuário pelo CPF
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
      console.log(
        `Usuário ${name} atualizado para Desfiliado no banco de dados.`
      );
    } catch (error) {
      console.error(`Erro ao atualizar o usuário no banco de dados:`, error);
      return;
    }

    // Atualizar o estado local
    setUpdatedUsers((prevTransactions) =>
      prevTransactions.map((transaction) =>
        transaction.cpf === cpf
          ? { ...transaction, newSituation: "Desfiliado" }
          : transaction
      )
    );

    // Fechar o modal de cancelamento e abrir o modal de cancelado
    closeModal("cancelModalVisible");
    openModal("canceledModalVisible");
  };

  const pendingTransactions = updatedUsers.filter(
    (item) =>
      item.newSituation && item.newSituation.toLowerCase() === "pendente"
  );

  const otherTransactions = updatedUsers.filter(
    (item) =>
      item.newSituation && item.newSituation.toLowerCase() !== "pendente"
  );

  return (
    <div className="data-import">
      <h1>Relatório de Atualizações</h1>
      <div className="transactions-container">
        <h2>Usuários Faltando</h2>
        <TransactionTable
          transactions={missingUsers}
          openModal={openModal}
          isMissing={true}
        />
        <h2>Usuários Atualizados</h2>
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
            data-testid="upInput"
          />
          <button
            className="import-button"
            onClick={() => document.getElementById("file-upload").click()}
          >
            Importar Arquivo CSV
          </button>
        </div>
      </div>

      {modals.clientModalVisible && (
        <>
          <div
            className="overlay"
            onClick={() => closeModal("clientModalVisible")}
          ></div>
          <ClientInformationModal
            transaction={selectedTransaction}
            onClose={() => closeModal("clientModalVisible")}
            onDesfiliar={() =>
              openModal("cancelModalVisible", selectedTransaction)
            }
            onQuitado={handleQuitado}
          />
        </>
      )}

      {modals.payedModalVisible && (
        <>
          <div
            className="overlay"
            onClick={() => closeModal("payedModalVisible")}
          ></div>
          <PayedModal onClose={() => closeModal("payedModalVisible")} />
        </>
      )}

      {modals.cancelModalVisible && (
        <>
          <div
            className="overlay"
            onClick={() => closeModal("cancelModalVisible")}
          ></div>
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
          <div
            className="overlay"
            onClick={() => closeModal("canceledModalVisible")}
          ></div>
          <CanceledModal onClose={() => closeModal("canceledModalVisible")} />
        </>
      )}
    </div>
  );
};

export default DataImport;
