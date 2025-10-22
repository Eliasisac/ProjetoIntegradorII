// src/PainelSolicitacoes.jsx

import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/components/usuario.css';
import PainelCliente from './PainelCliente'; 
import PainelTecnico from './PainelTecnico';
import PainelAdmin from './PainelAdmin'; 
import PainelEscolas from './PainelEscolas'; 

function PainelSolicitacoes() {
    const navigate = useNavigate();
    const [userRole, setUserRole] = useState(null);
    const [currentView, setCurrentView] = useState('');
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('userRole'); 
        
        if (!token || !role) {
            navigate('/');
            return;
        }

        setUserRole(role);
        
        if (role === 'admin') {
            setCurrentView('tickets'); 
        } else if (role === 'technician') {
            setCurrentView('filaGeral');
        } else if (role === 'client') {
            setCurrentView('meusChamados');
        } else {
             navigate('/');
        }

    }, [navigate]);

    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        navigate('/');
    };

    const renderContent = () => {
        if (!userRole) return <div>Carregando...</div>;
        
        switch (userRole) {
            case 'admin':
                if (currentView === 'tickets') return <PainelAdmin view="tickets" />;
                if (currentView === 'gerenciarUsuarios') return <PainelAdmin view="users" />;
                if (currentView === 'gerenciarEquipamentos') return <PainelAdmin view="equipments" />;
                if (currentView === 'gerenciarEscolas') return <PainelAdmin view="gerenciarEscolas" />;
                return <div>Admin - Selecione uma opção no menu.</div>;

            case 'technician':
                if (currentView === 'filaGeral') return <PainelTecnico view="filaGeral" />;
                if (currentView === 'meusAtendimentos') return <PainelTecnico view="meusAtendimentos" />;
                return <div>Técnico - Selecione uma opção no menu.</div>;

            case 'client':
                if (currentView === 'meusChamados') return <PainelCliente />;
                return <div>Cliente - Selecione uma opção no menu.</div>;

            default:
                return <div>Acesso Negado ou Papel Desconhecido</div>;
        }
    };

    const renderSidebar = () => (
        <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`} style={{ zIndex: 1030 }}> 
            <h2>
                <i className="bi bi-grid" onClick={toggleSidebar} style={{ cursor: 'pointer' }}></i>
                <span> Menu</span>
            </h2>
            
            {/* Menu Admin */}
            {userRole === 'admin' && (
                <>
                    <a href="#" onClick={() => setCurrentView('tickets')} className={currentView === 'tickets' ? 'active' : ''}>
                        <i className="bi bi-bar-chart-line"></i> <span>Visão Geral de Chamados</span>
                    </a>
                    <a href="#" onClick={() => setCurrentView('gerenciarUsuarios')} className={currentView === 'gerenciarUsuarios' ? 'active' : ''}>
                        <i className="bi bi-people"></i> <span>Gerenciar Usuários</span>
                    </a>
                    <a href="#" onClick={() => setCurrentView('gerenciarEquipamentos')} className={currentView === 'gerenciarEquipamentos' ? 'active' : ''}>
                        <i className="bi bi-pc-display"></i> <span>Gerenciar Equipamentos</span>
                    </a>
                    <a href="#" onClick={() => setCurrentView('gerenciarEscolas')} className={currentView === 'gerenciarEscolas' ? 'active' : ''}>
                        <i className="bi bi-building"></i> <span>Gerenciar Escolas</span>
                    </a>
                </>
            )}

            {/* Menu Técnico */}
            {userRole === 'technician' && (
                <>
                    <a href="#" onClick={() => setCurrentView('filaGeral')} className={currentView === 'filaGeral' ? 'active' : ''}>
                        <i className="bi bi-list-task"></i> <span>Fila Geral (Abertos)</span>
                    </a>
                    <a href="#" onClick={() => setCurrentView('meusAtendimentos')} className={currentView === 'meusAtendimentos' ? 'active' : ''}>
                        <i className="bi bi-tools"></i> <span>Meus Atendimentos</span>
                    </a>
                </>
            )}

            {/* Menu Cliente */}
            {userRole === 'client' && (
                 <a href="#" onClick={() => setCurrentView('meusChamados')} className={currentView === 'meusChamados' ? 'active' : ''}>
                    <i className="bi bi-ticket-detailed"></i> <span>Meus Chamados</span>
                 </a>
            )}

            <div className="sidebar-footer">
                <Button variant="link" onClick={handleLogout} className="logout-btn">
                    <i className="bi bi-box-arrow-right"></i> <span>Sair</span>
                </Button>
            </div>
        </div>
    );

    return (
        <div className={`painel-container ${isSidebarCollapsed ? 'collapsed' : ''}`}>
            {renderSidebar()}
            {}
            <div className={`main-content ${isSidebarCollapsed ? 'expanded' : ''}`}>
                <header className="main-header">
                    <h1>Painel de Chamados</h1>
                </header>
                <main className="main-body">
                    {renderContent()}
                </main>
            </div>
        </div>
    );
}

export default PainelSolicitacoes;
