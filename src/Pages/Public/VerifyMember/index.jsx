import "./index.css";
import LabeledTextField from "../../../Components/LabeledTextField";
import PrimaryButton from "../../../Components/PrimaryButton";
import SecondaryButton from "../../../Components/SecondaryButton";
import UnderlinedTextButton from "../../../Components/UnderlinedTextButton";
import { useState, useContext, useEffect } from "react";
import AuthContext, { useAuth } from "../../../Context/auth";
import { useNavigate } from "react-router-dom";
import Card from "../../../Components/Card";

const VerifyMember = () => {


    return (
        <div className="screen">
            <Card>
               <h1>
                   Teste!!
               </h1>
            </Card>
        </div>
    );
}

export default VerifyMember;
