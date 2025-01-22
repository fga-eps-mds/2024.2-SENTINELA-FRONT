import React from 'react';
import "./index.css";

export default function PayedModal() {
    return (
        <>
            <div className="alertaExclusao">

                <div className="caixaTextoMensagem">
                    <p className="textoMensagem">
                        Mensalidade Quitada
                    </p>
                    <button className="botaoFechar">
                        OK
                    </button>
                </div>
            </div>

        </>
    );
}
