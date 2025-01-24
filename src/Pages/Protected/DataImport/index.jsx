import React, { useState, useEffect } from "react";
import { APIBank } from "../../../Services/BaseService";
import PrimaryButton from "../../../Components/PrimaryButton";
import "./index.css";

const DataImport = () => {
    const [transactions, setTransactions] = useState([]);

    const storagedUser = JSON.parse(localStorage.getItem("@App:user"));

    useEffect(() => {
        const fetchTransactions = async () => {
          try {
            const response = await APIBank.get(`/financialMovements`, {
              headers: {
                Authorization: `Bearer ${storagedUser.token}`,
              },
            });
    
            const data = response.data;
            const fetchedTransactions = [];
           
            for (let i = 0; i < data.length; i++) {
                if(data[i].tipoDocumento == ""){
                    fetchedTransactions.push({
                        date: formatDateBanco(data[i].datadePagamento),
                        amount: data[i].valorBruto,
                        name: data[i].tipoDocumento,
                        memo: data[i].descricao,
                        isFixed: false,
                    });
                }
            }
            
            setTransactions(fetchedTransactions);
          } catch (error) {
            console.error("Erro ao buscar movimentos financeiros:", error);
          }
        };
    
        fetchTransactions();
      }, []);

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
                setTransactions((prevTransactions) => [...prevTransactions, ...parsedTransactions]);
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

    function formatDateBanco(str) {
        let date = new Date(str);
        let day = String(date.getDate()).padStart(2, '0');
        let month = String(date.getMonth() + 1).padStart(2, '0');
        let year = date.getFullYear();
        return `${day}/${month}/${year}`;
      }

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
                <div className="save-button">
                    <PrimaryButton 
                        text="SALVAR"
                        //onClick={handleSave}...
                    />
                </div>
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
