import { useAuth } from "../../../Context/auth";
import { useNavigate } from "react-router-dom";
import SecondaryButton from "../../../Components/SecondaryButton";
import "./index.css";
import sindpol_logo from "../../../assets/sindpol-logo.png";
import sentinela_logo from "../../../assets/sentinela-logo.png";
import { checkAction, usePermissions } from "../../../Utils/permission";
import LabeledTextField from "../../../../src/Components/LabeledTextField";
import DataSelect from "../../../Components/DataSelect/index.jsx";
import sindpolLogo from "../../../assets/sindpol-logo.png";


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
                    <div className="infoIMG">
                    <div className="carteirinha-info">
                        <body className="titular">
                        <strong>TITULAR: </strong>
                        <div>{list.titular}</div>
                        </body>
                        <div className="datas">
                        <div className="dataDeNascimento">
                        <p > <strong>DATA DE NASCIMENTO:</strong> </p> <br/> <p><spam className="teste"> {list.dataDeNascimento}</spam> </p>
                        </div>
                        <div className="dataExpedicao">
                        <p> <strong>DATA DE EXPEDIÇÃO:</strong> </p> <br/> <p><spam className="teste"> {list.dataExpedicao}</spam> </p>
                        </div>
                        </div>
                        <div className="CPFValidade">
                        <div className="CPF">
                        <p><strong>CPF:</strong></p> <br/> <p> <spam className="teste"> {list.CPF}</spam> </p>
                        </div>
                        <div className="validade">
                        <p><strong>VALIDADE:</strong></p> <br/> <p> <spam className="teste"> {list.validade}</spam> </p>
                        </div>
                        </div>
                    
                    
                    </div>
                    <div className="sindpolLogo">
                        <img src={sindpolLogo} alt="Logo Sindpol"/>
                        <h1>SINDICALIZADO</h1>
                    </div>  
                    </div>

                    
                </div>

                


            </section>
        )
    );
};

export default Carteirinha;
