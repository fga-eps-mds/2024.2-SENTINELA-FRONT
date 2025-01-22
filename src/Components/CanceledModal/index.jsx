import React from 'react';
import "./index.css";

export default function CanceledModal() {
    return (
        <>
            <div className="alertaExclusao">
                <div className="caixaTextoMensagem">
                    <p className="textoMensagem">
                        Mensalidade Cancelada
                    </p>
                    <button className="botaoFechar">
                        OK
                    </button>
                </div>
            </div>

        </>
    );
}
