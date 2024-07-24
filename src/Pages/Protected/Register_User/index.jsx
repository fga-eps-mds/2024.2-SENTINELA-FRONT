import React, { useEffect, useState } from 'react';
import { Navigate, useNavigate } from "react-router-dom";
import "./index.css";
import "../../../index.css";
import SideBar from "../../../Components/SideBar";
import SideButton from "../../../Components/SideButton";
import FieldText from "../../../Components/FieldText";
import FieldSelect from "../../../Components/FieldSelect";
import FieldNumber from '../../../Components/FieldNumber';
import Checklist from '../../../Components/Checklist';
import PrimaryButton from '../../../Components/PrimaryButton';
import { ToggleButton, Radio, RadioGroup, FormControlLabel, Button } from '@mui/material'; 
import {createUser, getRoles } from '../../../Services/userService';
import { RiLogoutCircleRLine } from 'react-icons/ri';
import { AiOutlineUser } from 'react-icons/ai';
import Modal from '../../../Components/Modal';

export default function Register_User(){
    //Dados a serem armazenados
    const navigate = useNavigate(); 
    const [nomeCompleto, setNomeCompleto] = useState(''); 
    const [celular, setCelular] = useState(''); 
    const [login, setLogin] = useState(''); 
    const [email, setEmail] = useState('');
    // const [acessos, setAcessos] = useState([]); 
    // const [checklistVisible, setChecklistVisible] = useState(false);
    const [perfilSelecionado, setPerfilSelecionado] = useState('');
    const [roles, setRoles] = useState ([])
    const [showModal,setShowModal] = useState(false);
    
    const handleHomeClick = () => {
        navigate("/home");
    };

    const handleRegistrationClick = () => {
        navigate("/cadastros");
    };

    //Variáveis de controle e display da página
    const buttons = [
        <SideButton key="home" text="Pagina Inicial" onClick={handleHomeClick}/>,
        <SideButton key="cadastros" text="Cadastros" onClick={handleRegistrationClick}/>,
        <SideButton key="financeiro" text="Financeiro"/>,
        <SideButton key="benefícios" text="Benefícios"/>,
        // <h2 className="profile-status">Você está logado <br />como {nome} <AiOutlineUser className="profile-icon" /></h2>,
        // <button className="btn-logout" onClick={handleLogout}> LOGOUT <RiLogoutCircleRLine className="logout-icon" /> </button>
    ];

    // const handleListaClick = () => {
    //     navigate("/listadeusuarios");
    // };

    const login_options = ['Ativo', 'Inativo'];
    const handleChangeLogin = (event) => {
        setLogin(event.target.value);
    };

    // const toggleChecklistVisibility = () => {
    //     setChecklistVisible(!checklistVisible);
    // };

    const handlePerfilChange = (event) => {
        setPerfilSelecionado(event.target.value);
    };

    const isValidEmail = (email) => {
        const allowedDomains = [
          'com', 'net', 'org', 'com.br', 'org.br'
        ]; /* ainda necessário melhoria */ 
        const domainPattern = allowedDomains.join('|'); 
        const emailRegex = new RegExp(`^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.${domainPattern}$`, 'i');
        return emailRegex.test(email);
    };

    const removeMask = (celular) => celular.replace(/\D/g, '');
    
    const handleCloseDialog = () => {
        setShowModal(false);
        navigate("/home");
    };

    const handleNomeCompletoChange = (e) => {
        const value = e.target.value.replace(/[^a-zA-Z\s]/g, '');
        setNomeCompleto(value);
    };

    const handleSubmit = async (e) => {
        const trimmedCelular = removeMask(celular);
        const isValidNumber = /^\d+$/.test(trimmedCelular) && trimmedCelular.length >= 10; // Número válido = [0,9] e maior que 10 digitos
        const isValidEmailAddress = isValidEmail(email); 

        if (!isValidNumber || !isValidEmailAddress) {
            return;
        }

        const userData = {
            name: nomeCompleto,
            email: email,
            phone: celular,
            status: login === 'Ativo', // Convertendo status de login para boolean
            role: perfilSelecionado, // Assumindo que perfilSelecionado é o ID da role
        };

        try {
            const response = await createUser(userData);
            console.log('Usuário criado com sucesso:', response);
            setShowModal(true);
            // Lógica adicional após a criação do usuário
        } catch (error) {
            console.error('Erro ao criar usuário', error);
        }
    };    

    useEffect(()=>{
        const loadRoles = async () => {
            const roles = await getRoles();
            setRoles(roles);
        };
        loadRoles();
    }, []);

    //Configuração da página
    return (
        <section className="container">
            <div className="bar-container">
                <SideBar buttons={buttons} />
            </div>

            <div className='forms-container'>
                <h1>Cadastro de usuário</h1>

                <h3>Dados Pessoais</h3>
                <FieldText
                    label="Nome Completo"
                    value={nomeCompleto}
                    onChange={handleNomeCompletoChange}
                />

                <div className='double-box'>
                    <FieldNumber
                        label="Celular"
                        value={celular}
                        onChange={(e) => setCelular(e.target.value)}
                        format='(##) ##### ####'
                    />

                    <FieldSelect
                        label="Login"
                        value={login}
                        onChange={handleChangeLogin}
                        options={login_options}
                    />
                </div>

                <FieldText
                    label="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                {/* <div className='ToggleButton'>
                    <ToggleButton variant="Setores de Acesso" onClick={toggleChecklistVisibility}>
                    Setores de Acesso
                    </ToggleButton>
                </div> */}
                
                {/* {checklistVisible && (
                    <div className='teste'>// const [checklistVisible, setChecklistVisible] = useState(false);
                        <Checklist
                            items={setoresAcesso}
                            value={acessos}
                            onChange={setAcessos}
                        />
                    </div>
                )} */}
                
                <h3>Perfil</h3>

                <RadioGroup value={perfilSelecionado} onChange={handlePerfilChange}>
                    {roles.map((perfil) => (
                        <FormControlLabel
                            key={perfil?.name}
                            value={perfil?._id}
                            control={<Radio />}
                            label={perfil?.name}
                        />
                    ))}
                </RadioGroup>

                <PrimaryButton
                    text='Cadastrar'
                    onClick={()=>handleSubmit()}
                />
                {/* <Dialog 
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                    className="custom-dialog"
                >
                <DialogTitle className="alert-dialog-title">{"Cadastro de Usuário Concluido"}</DialogTitle>
                <DialogActions>
                <Button onClick={handleCloseDialog} className="custom-dialog-button">
                OK
                </Button>
                </DialogActions>
                </Dialog> */}
                <Modal
                    width="338px"
                    text="OK"
                    alertTitle="Cadastro de usuário concluído"
                    show={showModal}
                    onClick={() => handleCloseDialog()}
                />
                
            </div>
        </section>
    );
}
