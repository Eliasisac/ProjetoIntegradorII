// src/PainelSolicitacoes.jsx
// src/PainelSolicitacoes.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button, Modal ,Container, Row, Col, Table, Form } from 'react-bootstrap'; // Importamos os componentes do Bootstrap
import 'bootstrap-icons/font/bootstrap-icons.css'; // Importa a biblioteca de ícones
import './assets/components/usuario.css'; // Importa o CSS específico para este componente
import FormularioNovoChamado from './assets/components/FormularioNovoChamado'

function PainelSolicitacoes() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [showModal, setShowModal] = useState(false);

    // Função para alternar o estado da sidebar
    const toggleSidebar = () => {
        setIsSidebarCollapsed(!isSidebarCollapsed);
    };
     // Funções para abrir e fechar o modal
    const handleShowModal = () => {
    console.log("Clicou no botão para abrir o modal!");
    setShowModal(true);
    };
    const handleCloseModal = () => setShowModal(false);

    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/';
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/tickets', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar solicitações');
                }

                const data = await response.json();
                setTickets(data.tickets);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Carregando solicitações...</div>;
    if (error) return <div style={{ padding: '20px' }}>Erro: {error}</div>;

    // Filtros para o resumo, com base no seu PDF
    const totalTickets = tickets.length;
    const prioridadeBaixa = tickets.filter(t => t.prioridade === 'baixa').length;
    const prioridadeMedia = tickets.filter(t => t.prioridade === 'media').length;
    const prioridadeAlta = tickets.filter(t => t.prioridade === 'alta').length;

    return (
        <div className={`app-wrapper ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
            {/* Sidebar - Agora uma div com classe 'sidebar' */}
            <div className={`sidebar ${isSidebarCollapsed ? 'collapsed' : ''}`}>
                <h2>
                    <i className="bi bi-grid" onClick={toggleSidebar} style={{ cursor: 'pointer' }}></i>
                    <span> Menu</span>
                </h2>
                <a href="#"><i className="bi bi-clock-history"></i> <span>Prioridades</span></a>
                <a href="#"><i className="bi bi-list-task"></i> <span>Solicitações Pendentes</span></a>
                {/* Outros itens */}
            </div>

            {/* Conteúdo Principal - Div com classe 'content' */}
            <div className={`content ${isSidebarCollapsed ? 'expanded' : ''}`}>
                <h4>Solicitações Pendentes <br />
                    <small className="text-muted">Setembro 2025</small>
                </h4>

                {/* Seus botões de resumo */}
                <div className="d-flex gap-2 mb-3">
                    <Button className="btn btn-primary">Total de Chamados ({totalTickets})</Button>
                    <Button className="btn pri-baixa">Prioridade Baixa ({prioridadeBaixa})</Button>
                    <Button className="btn pri-media">Prioridade Média ({prioridadeMedia})</Button>
                    <Button className="btn pri-alta">Prioridade Alta ({prioridadeAlta})</Button>
                   <a
                        className="btn btn-primary ms-auto"
                        onClick={handleShowModal}
                        href="#"
                    >
                        Abrir Chamado
                    </a>
                </div>

                {/* Tabela de Solicitações */}
                <div className="table-responsive">
                    <table className="table table-hover align-middle">
                        <thead className="table-dark">
                            <tr>
                                <th>ID</th>
                                <th>Prioridade</th>
                                <th>Tema</th>
                                <th>Solicitante</th>
                                <th>Data de Abertura</th>
                                <th>Cidade</th>
                                <th>Marca</th>
                            </tr>
                        </thead>
                        <tbody>
                            {tickets.map(ticket => (
                                <tr key={ticket.id}>
                                    <td>{ticket.id.substring(0, 8)}</td>
                                    <td className={`pri-${ticket.prioridade}`}>
                                        <span className={`badge ${ticket.prioridade === 'baixa' ? 'pri-baixa' : ticket.prioridade === 'media' ? 'pri-media' : 'pri-alta'}`}>
                                            {ticket.prioridade}
                                        </span>
                                    </td>
                                    <td>{ticket.titulo}</td>
                                    <td>{ticket.creator.nome}</td>
                                   <td>{new Date(ticket.dataAbertura).toLocaleDateString('pt-BR')}</td>
                                    <td>{ticket.cidade}</td>
                                    <td>{ticket.marca}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
             <FormularioNovoChamado show={showModal} handleClose={handleCloseModal} />
        </div>
    );
}

export default PainelSolicitacoes;