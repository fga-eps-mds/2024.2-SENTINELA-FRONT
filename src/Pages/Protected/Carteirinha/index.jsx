import { useAuth } from "../../../Context/auth";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../../Components/SecondaryButton";
import "./index.css";
import sindpol_logo from "../../../assets/sindpol-logo.png";
import sentinela_logo from "../../../assets/sentinela-logo.png";
import { checkAction, usePermissions } from "../../../Utils/permission";
import LabeledTextField from "../../../../src/Components/LabeledTextField";
import DataSelect from "../../../Components/DataSelect/index.jsx";

const Carteirinha = () => {
    const { user } = useAuth();
    const permissions = usePermissions();
    const list = {titular:"Dannyeclisson", dataDeNascimento:"24/11/2001", dataExpedicao:"21/06/2019", CPF:"07488558154", validade:"teste"}
    return (
        user && (
            <section className="container">
                <div className="row">
                    <card>
                        <p><strong>TITULAR: </strong>{list.titular} </p>
                        <p><strong>DATA DE NASCIMENTO: </strong>{list.dataDeNascimento} </p>
                        <p><strong>DATA DE EXPEDIÇÃO: </strong>{list.dataExpedicao} </p>
                        <p><strong>CPF: </strong>{list.CPF} </p>
                        <p><strong>VALIDADE: </strong>{list.validade} </p>


                    </card>
                </div>


            </section>
        )
    );
};

export default Carteirinha;
