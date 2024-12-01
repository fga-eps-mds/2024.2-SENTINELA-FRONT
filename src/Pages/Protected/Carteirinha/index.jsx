import { useAuth } from "../../../Context/auth";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../../Components/SecondaryButton";
import "./index.css";
import sindpol_logo from "../../../assets/sindpol-logo.png";
import sentinela_logo from "../../../assets/sentinela-logo.png";
import { checkAction, usePermissions } from "../../../Utils/permission";
import LabeledTextField from "../../../../src/Components/LabeledTextField";
import DataSelect from "../../../Components/DataSelect/index.jsx";
import LogoSentinela from "../../../assets/sindpol-logo.png";

const Carteirinha = () => {
    const { user } = useAuth();
    const permissions = usePermissions();
    const list = {titular:"Dannyeclisson", dataDeNascimento:"24/11/2001", dataExpedicao:"21/06/2019", CPF:"074.885.581-54", validade:"teste"}
    return (
        user && (
            <section className="container">
                <div className="card">
                    <header className="carteirinha-header">
                        <h1>SINDPOL-DF</h1>
                        <p>SINDICATO DOS POLICIAIS PENAIS DO DISTRITO FEDERAL</p>
                    </header>
                    <div className="carteirinha-info">
                        <body className="titular">
                        <strong>TITULAR: </strong>
                        <div>{list.titular}</div>
                        </body>
                        <body className="dataDeNascimento">
                        <strong>DATA DE NASCIMENTO: </strong>
                        <div>{list.dataDeNascimento}</div>
                        </body>
                        <body className="dataExpedicao">
                        <strong>DATA DE EXPEDIÇÃO: </strong>
                        <div>{list.dataExpedicao}</div>
                        </body>
                        <body className="CPF">
                        <strong>CPF: </strong>
                        <div>{list.CPF}</div>
                        </body>
                        <body className="validade">
                        <strong>VALIDADE: </strong>
                        <div>{list.validade}</div>
                        </body>
                        <body>
                        <img src = "LogoSentinela.png"/>   
                        </body>
                    </div>
                </div>


            </section>
        )
    );
};

export default Carteirinha;
