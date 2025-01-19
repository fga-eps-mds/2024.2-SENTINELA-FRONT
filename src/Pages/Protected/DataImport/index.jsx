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

        console.log("Arquivo selecionado:", file);

        const reader = new FileReader();
        reader.onload = () => {
            const content = reader.result;

            console.log("Conteúdo do arquivo:", content);

            try {
                const parsedTransactions = [];
                const transactionRegex = /<STMTTRN>[\s\S]*?<TRNTYPE>(.*?)<\/TRNTYPE>[\s\S]*?<DTPOSTED>([\d]+)<\/DTPOSTED>[\s\S]*?<TRNAMT>([-\d.]+)<\/TRNAMT>[\s\S]*?<NAME>(.*?)<\/NAME>[\s\S]*?<MEMO>(.*?)<\/MEMO>/g;
                let match;

                while ((match = transactionRegex.exec(content)) !== null) {
                    const rawDate = match[2];
                    const formattedDate = formatDate(rawDate);

                    parsedTransactions.push({
                        trnType: match[1],
                        date: formattedDate,
                        amount: parseFloat(match[3]),
                        name: match[4],
                        memo: match[5],
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
            <h1>Importar OFX</h1>
            <input type="file" accept=".ofx" onChange={handleFileUpload} />
            <table className="data-table">
                <thead>
                <tr>
                    <th>Tipo</th>
                    <th>Data</th>
                    <th>Valor</th>
                    <th>Nome</th>
                    <th>Descrição</th>
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
                            <td>{transaction.trnType}</td>
                            <td>{transaction.date}</td>
                            <td>{transaction.amount.toFixed(2)}</td>
                            <td>{transaction.name}</td>
                            <td>{transaction.memo}</td>
                        </tr>
                    ))
                )}
                </tbody>
            </table>
        </div>
    );
};

export default DataImport;
