import React from 'react';
import "./index.css";

export default function ClientInformationModal() {
    return (
        <>
            <div className="containerInformacao">

            <p className="tituloTitular">
                TITULAR</p>
            <p className="nomeTitular"> 
                {/*Aqui vai o nome do contribuinte tirado do banco*/}
            </p >

            <p className="tituloCpf">
                CPF</p>
            <p className="cpfTitular"> 
                {/*Aqui vai o CPF do contribuinte tirado do banco*/}
            </p >

            <p className="tituloStatus">
                STATUS</p>
            <p className="statusTitular"> 
                {/*Aqui vai o Status do contribuinte tirado do banco*/}
            </p >


                <button className="botaoParaDesfiliar">
                    DESFILIAR
                </button>
                <button className="botaoParaVoltar">
                    VOLTAR
                </button>
                <button className="botaoQuitar">
                    QUITAR
                </button>
            </div>

        </>
    );
}
