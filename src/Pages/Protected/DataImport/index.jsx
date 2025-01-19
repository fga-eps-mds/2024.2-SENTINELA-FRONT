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
                const transactionRegex = /<STMTTRN>[\s\S]*?<DTPOSTED>([\d]+)[\s\S]*?<TRNAMT>([-\d.]+)[\s\S]*?(?:<NAME>(.*?)<\/NAME>[\s\S]*?)?(?:<MEMO>(.*?)<\/MEMO>)?/g;
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


    return (
        <div className="data-import">
            <div className = "titulo-extrato">Importar Extrato Bancário</div>
            <input type="file" accept=".ofx" onChange={handleFileUpload}/>
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
