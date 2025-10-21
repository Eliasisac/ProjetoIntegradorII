// src/PainelTecnico.jsx

import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Alert } from 'react-bootstrap';
import FormularioSolicitacao from './FormularioSolicitacao';
import { jwtDecode } from 'jwt-decode'; 

const API_BASE = 'http://localhost:5000/api';

const PainelTecnico = ({ view }) => {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        let endpoint = `${API_BASE}/tickets?limit=100`;
        
        if (view === 'filaGeral') {
            // Busca chamados abertos sem técnico
            endpoint += '&fila=geral'; 
        } else if (view === 'meusAtendimentos') {
            // Busca chamados atribuídos ao técnico logado
            endpoint += '&fila=meus'; 
        }

        try {
            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao buscar chamados.`);
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
    }, [view]);

    const handleAcceptTicket = async (ticketId) => {
        const token = localStorage.getItem('token');
        
        try {
            const decoded = jwtDecode(token);
            const technicianId = decoded.id; 

            const response = await fetch(`${API_BASE}/tickets/${ticketId}`, {
                method: 'PUT',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                // técnicoId será o ID do próprio técnico logado.
                // O status é forçado a 'em andamento' na aceitação.
                body: JSON.stringify({ tecnicoId: technicianId, status: 'em andamento' }) 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao aceitar chamado.');
            }

            alert('Chamado aceito e movido para "Meus Atendimentos"!');
            fetchTickets(); // Recarrega a lista para remover o ticket da fila geral
        } catch (err) {
            alert(`Erro: ${err.message}`);
        }
    };

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
            <h4>{view === 'filaGeral' ? 'Fila Geral (Chamados Abertos)' : 'Meus Atendimentos'}</h4>
            
            <div className="table-responsive">
                <Table hover responsive striped>
                    <thead className="table-dark">
                        <tr>
                            <th>ID</th>
                            <th>Prioridade</th>
                            <th>Título</th>
                            <th>Solicitante</th>
                            <th>Data Abertura</th>
                            <th>Status</th>
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
                                <td>{ticket.creator.nome}</td>
                                <td>{new Date(ticket.createdAt).toLocaleDateString('pt-BR')}</td>
                                <td>{ticket.status}</td>
                                <td>
                                    {view === 'filaGeral' ? (
                                        <Button variant="success" size="sm" onClick={() => handleAcceptTicket(ticket.id)}>
                                            Aceitar
                                        </Button>
                                    ) : (
                                        <Button variant="warning" size="sm" onClick={() => handleShowDetails(ticket)}>
                                            Gerenciar
                                        </Button>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>
            
            {selectedTicket && (
                <FormularioSolicitacao 
                    show={showDetailsModal} 
                    handleClose={() => setShowDetailsModal(false)}
                    ticketData={selectedTicket}
                    isEditable={true} // Técnico pode editar status e resolução
                    onUpdate={fetchTickets} // Recarrega após o técnico gerenciar
                />
            )}
        </div>
    );
};

export default PainelTecnico;