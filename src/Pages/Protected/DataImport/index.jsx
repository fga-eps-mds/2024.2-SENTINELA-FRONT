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
                const transactionRegex = /<STMTTRN>[\s\S]*?<DTPOSTED>([\d]+)[\s\S]*?<TRNAMT>([-\d.]+)[\s\S]*?(?:<NAME>(.*?)<\/NAME>)?[\s\S]*?(?:<MEMO>(.*?)<\/MEMO>)?/g;
                const accountInfoRegex = /<BANKACCTFROM>[\s\S]*?<BANKID>(.*?)<\/BANKID>[\s\S]*?<ACCTID>(.*?)<\/ACCTID>[\s\S]*?<ACCTTYPE>(.*?)<\/ACCTTYPE>/;
                const includeTransactionRegex = /<INCTRAN>[\s\S]*?<INCLUDE>(.*?)<\/INCLUDE>/;

                // Captura informações de transações
                let match;
                while ((match = transactionRegex.exec(content)) !== null) {
                    const rawDate = match[1];
                    const formattedDate = formatDate(rawDate);

                    parsedTransactions.push({
                        date: formattedDate,
                        amount: parseFloat(match[2]),
                        name: match[3] || "N/A", // Valor padrão se NAME não existir
                        memo: match[4] || "N/A", // Valor padrão se MEMO não existir
                    });
                }

                // Captura informações da conta bancária (se disponível)
                const accountMatch = accountInfoRegex.exec(content);
                if (accountMatch) {
                    console.log("Informações da conta bancária:");
                    console.log("Banco ID:", accountMatch[1]);
                    console.log("Conta ID:", accountMatch[2]);
                    console.log("Tipo de conta:", accountMatch[3]);
                }

                // Verifica se as transações devem ser incluídas (se disponível)
                const includeMatch = includeTransactionRegex.exec(content);
                if (includeMatch) {
                    console.log("Incluir transações:", includeMatch[1] === "Y" ? "Sim" : "Não");
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

        const headers = ["Descrição", "Valor (R$)", "Data", "Nome"];
        const rows = transactions.map((transaction) => [
            transaction.memo,
            transaction.amount.toFixed(2),
            transaction.date,
            transaction.name,
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

    return (
        <div className="data-import">
            <div className="titulo-extrato">Importar Extrato Bancário</div>
            <input type="file" accept=".ofx" onChange={handleFileUpload} />
            {transactions.length > 0 && (
                <button className="export-button" onClick={exportToCSV}>
                    Exportar para CSV
                </button>
            )}
            <table className="data-table">
                <thead>
                <tr>
                    <th>Descrição</th>
                    <th>Valor (R$)</th>
                    <th>Data</th>
                    <th>Nome</th>
                </tr>
                </thead>
                <tbody>
                {transactions.length === 0 ? (
                    <tr>
                        <td colSpan="4">Nenhuma transação encontrada.</td>
                    </tr>
                ) : (
                    transactions.map((transaction, index) => (
                        <tr key={index}>
                            <td>{transaction.memo}</td>
                            <td>{transaction.amount.toFixed(2)}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.name}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>

        </div>
    );
};

export default DataImport;
