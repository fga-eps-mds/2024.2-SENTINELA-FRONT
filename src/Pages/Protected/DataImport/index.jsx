import React, { useState } from "react";
import "./index.css";

const DataImport = () => {
    const [transactions, setTransactions] = useState([]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (!file) {
            console.error("Nenhum arquivo selecionado.");
            return;
        }

        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result;

            try {
                const parsedTransactions = [];
                const transactionRegex = /<STMTTRN>[\s\S]*?<DTPOSTED>([\d]+)[\s\S]*?<TRNAMT>([-\d.]+)[\s\S]*?<NAME>(.*?)<\/NAME>[\s\S]*?<MEMO>(.*?)<\/MEMO>/g;

                let match;
                while ((match = transactionRegex.exec(content)) !== null) {
                    const rawDate = match[1];
                    const formattedDate = formatDate(rawDate);

                    parsedTransactions.push({
                        date: formattedDate,
                        amount: parseFloat(match[2]),
                        name: match[3] ? match[3].trim() : "N/A",
                        memo: match[4] ? match[4].trim() : "N/A",
                        isFixed: false, // define as checkbox da coluna "Fixo" como falsa por padrao
                    });
                }

                console.log("Transações extraídas:", parsedTransactions);
                setTransactions(parsedTransactions);
            } catch (error) {
                console.error("Erro ao processar o arquivo:", error);
            }
        };

        reader.onerror = () => {
            console.error("Erro ao ler o arquivo.");
        };

        reader.readAsText(file);
    };

    const formatDate = (rawDate) => {
        const year = rawDate.substring(0, 4);
        const month = rawDate.substring(4, 6);
        const day = rawDate.substring(6, 8);
        return `${day}/${month}/${year}`;
    };

    const exportToCSV = () => {
        if (transactions.length === 0) {
            alert("Nenhuma transação para exportar.");
            return;
        }

        const headers = ["Descrição", "Valor (R$)", "Data", "Nome", "Fixo"];
        const rows = transactions.map((transaction) => [
            transaction.memo,
            transaction.amount.toFixed(2),
            transaction.date,
            transaction.name,
            transaction.isFixed ? "Sim" : "Não", // adiciona a coluna fixo ao csv
        ]);

        const csvContent = [headers, ...rows]
            .map((row) => row.join(","))
            .join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);

        const link = document.createElement("a");
        link.href = url;
        link.download = "transacoes.csv";
        link.click();

        URL.revokeObjectURL(url);
    };

    // alterna o estado da checkbox "Fixo"
    const handleCheckboxChange = (index) => {
        const newTransactions = [...transactions];
        newTransactions[index].isFixed = !newTransactions[index].isFixed;
        setTransactions(newTransactions);
    };

    return (
        <div className="data-import">
            <div className="titulo-extrato">Importar Extrato Bancário</div>
            <div className="botoes">
                <div className="upload-arquivo">
                    <label className="input-ofx" for="file-upload">SELECIONE UM ARQUIVO</label>
                    <input id="file-upload" type="file" accept=".ofx" onChange={handleFileUpload} />
                </div>
                {transactions.length > 0 && (
                    <button className="export-button" onClick={exportToCSV}>
                        Exportar para CSV
                    </button>
                )}
            </div>
            <table className="data-table">
                <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Valor (R$)</th>
                    <th>Data</th>
                    <th>Nome</th>
                    <th>Fixo</th>
                </tr>
                </thead>
                <tbody>
                {transactions.length === 0 ? (
                    <tr>
                        <td colSpan="5">Nenhuma transação encontrada.</td>
                    </tr>
                ) : (
                    transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.memo}</td>
                            <td>{transaction.amount.toFixed(2)}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.name}</td>
                            <td>
                                <input
                                    type="checkbox"
                                    checked={transaction.isFixed}
                                    onChange={() => handleCheckboxChange(index)} // Alterna o valor da checkbox
                                />
                            </td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DataImport;
