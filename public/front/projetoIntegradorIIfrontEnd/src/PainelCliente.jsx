// src/PainelCliente.jsx

import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Alert } from 'react-bootstrap';
import FormularioNovoChamado from './FormularioNovoChamado';
import FormularioSolicitacao from './FormularioSolicitacao';
import { jwtDecode } from 'jwt-decode';

const API_BASE = 'http://localhost:5000/api';

const PainelCliente = () => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showNewTicketModal, setShowNewTicketModal] = useState(false);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE}/tickets`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao buscar seus chamados');
            }

            const data = await response.json();
            setTickets(data.tickets);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const handleShowDetails = (ticket) => {
        setSelectedTicket(ticket);
        setShowDetailsModal(true);
    };

    const getPriorityVariant = (prioridade) => {
        switch (prioridade) {
            case 'alta': return 'danger';
            case 'media': return 'warning';
            case 'baixa': return 'success';
            default: return 'secondary';
        }
    };

    if (loading) return <Spinner animation="border" className="m-5" />;
    if (error) return <Alert variant="danger" className="m-5">Erro: {error}</Alert>;

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Meus Chamados Abertos e Fechados</h4>
                <Button variant="primary" onClick={() => setShowNewTicketModal(true)}>
                    <i className="bi bi-plus-circle me-2"></i> Abrir Novo Chamado
                </Button>
            </div>
            
            <div className="table-responsive">
                <Table hover responsive striped>
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Prioridade</th>
                            <th>Título</th>
                            <th>Status</th>
                            <th>Técnico</th>
                            <th>Data Abertura</th>
                            <th>Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map(ticket => (
                            <tr key={ticket.id}>
                                <td>{ticket.id.substring(0, 8)}</td>
                                <td>
                                    <span className={`badge bg-${getPriorityVariant(ticket.prioridade)}`}>
                                        {ticket.prioridade}
                                    </span>
                                </td>
                                <td>{ticket.titulo}</td>
                                <td>{ticket.status}</td>
                                <td>{ticket.technician ? ticket.technician.nome : 'N/A'}</td>
                                <td>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td>
                                    <Button variant="outline-info" size="sm" onClick={() => handleShowDetails(ticket)}>
                                        Detalhes
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            <FormularioNovoChamado 
                show={showNewTicketModal} 
                handleClose={() => setShowNewTicketModal(false)} 
                onTicketCreated={fetchTickets}
            />
            {selectedTicket && (
                <FormularioSolicitacao 
                    show={showDetailsModal} 
                    handleClose={() => setShowDetailsModal(false)}
                    ticketData={selectedTicket} 
                    isEditable={false}
                />
            )}
        </div>
    );
};

export default PainelCliente;