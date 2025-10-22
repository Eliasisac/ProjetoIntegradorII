// src/PainelTicketsAdmin.jsx
import React, { useState, useEffect } from 'react';
import { Card, Table, Button, Spinner, Alert, Row, Col } from 'react-bootstrap';
import FormularioSolicitacao from './FormularioSolicitacao';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_BASE = 'http://localhost:5000/api';

const TICKET_STATUS = {
    all: 'Todos',
    aberto: 'Abertos',
    'em andamento': 'Em Andamento',
    resolvido: 'Resolvidos',
    fechado: 'Fechados',
};

const PRIORITY_COLOR_MAP = {
    total: 'primary',
    alta: 'danger',
    media: 'warning',
    baixa: 'success',
};

const getPriorityVariant = (prioridade) => {
    switch (prioridade) {
        case 'alta': return 'danger';
        case 'media': return 'warning';
        case 'baixa': return 'success';
        default: return 'secondary';
    }
};

const TABLE_HEADERS = [
    'Prioridade',
    'ID',
    'Título',
    'Status',
    'Solicitante',
    'Técnico',
    'Escola',
    'Localização',
    'Data Abertura',
    'Ações'
];

const PainelTicketsAdmin = () => {
    const [tickets, setTickets] = useState([]);
    const [counts, setCounts] = useState({ total: 0, baixa: 0, media: 0, alta: 0 });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filterStatus, setFilterStatus] = useState('all');
    
    const [showDetailsModal, setShowDetailsModal] = useState(false);
    const [selectedTicket, setSelectedTicket] = useState(null);

    const fetchTickets = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        let endpoint = `${API_BASE}/tickets?limit=100`;
        if (filterStatus !== 'all') {
            endpoint += `&status=${encodeURIComponent(filterStatus)}`;
        }

        try {
            const response = await fetch(endpoint, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                throw new Error(errorData.message || 'Erro ao buscar chamados.');
            }

            const data = await response.json();
            const ticketList = Array.isArray(data.tickets) ? data.tickets : [];

            setTickets(ticketList);
            
            // CALCULO DE CONTADORES
            const newCounts = { total: ticketList.length, baixa: 0, media: 0, alta: 0 };
            ticketList.forEach(ticket => {
                const p = ticket.prioridade;
                if (p) newCounts[p] = (newCounts[p] || 0) + 1;
            });
            setCounts(newCounts);

        } catch (err) {
            setError(err.message || 'Erro desconhecido');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchTickets();
    }, [filterStatus]);

    const handleShowDetails = (ticket) => {
        setSelectedTicket(ticket);
        setShowDetailsModal(true);
    };
    
    const handleFilterChange = (status) => {
        setFilterStatus(status);
    };

    if (loading) return <Spinner animation="border" className="m-5" />;
    if (error) return <Alert variant="danger" className="m-5">Erro: {error}</Alert>;

    return (
        <div className="p-4">
            
            {/*  */}
            <Card className="shadow-sm mb-4">
                <Card.Header className="bg-white border-bottom">
                    <h2 className="mb-0">Visão Geral dos Chamados (Admin)</h2>
                </Card.Header>
                
                <Card.Body>
                    
                    {}
                    <Row className="mb-4 g-3">
                        {['total', 'baixa', 'media', 'alta'].map((prio) => (
                            <Col lg={3} md={6} key={prio}>
                                <Card className="shadow-sm border-0">
                                    {}
                                    <Card.Body className={`p-3 bg-${PRIORITY_COLOR_MAP[prio]} text-white`}>
                                        <div className="d-flex flex-column">
                                            {/* Contagem (Número de Chamados) */}
                                            <Card.Text as="h3" className="fw-bold mb-0">{counts[prio] ?? 0}</Card.Text>
                                            {/* Título (Tipo de Chamado) */}
                                            <Card.Title as="h6" className="text-uppercase fw-bold mb-0" style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                                {prio === 'total' ? 'TOTAL DE CHAMADOS' : `PRIORIDADE ${prio.toUpperCase()}`}
                                            </Card.Title>
                                        </div>
                                    </Card.Body>
                                </Card>
                            </Col>
                        ))}
                    </Row>
        
                    {/* FILTROS DE STATUS */}
                    <div className="d-flex gap-2 flex-wrap pt-2">
                        <span className="fw-bold me-2 text-muted">Filtrar Status:</span>
                        {Object.keys(TICKET_STATUS).map((statusKey) => (
                            <Button 
                                key={statusKey} 
                                variant={filterStatus === statusKey ? 'primary' : 'outline-secondary'}
                                onClick={() => handleFilterChange(statusKey)}
                                size="sm"
                            >
                                {TICKET_STATUS[statusKey]}
                            </Button>
                        ))}
                    </div>
                </Card.Body>
            </Card>

            {/* TABELA DE CHAMADOS */}
            <Card className="shadow-sm mt-4">
                <Card.Header className="bg-light border-bottom">
                    Chamados Encontrados ({tickets.length})
                </Card.Header>
                <Card.Body className="p-0">
                    <div className="table-responsive">
                        <Table hover responsive className="mb-0">
                            <thead className="table-dark">
                                <tr>
                                    {TABLE_HEADERS.map((h) => (
                                        <th key={h}>{h}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {tickets.map(ticket => (
                                    <tr key={ticket.id} className="align-middle">
                                        <td>
                                            <span className={`badge bg-${getPriorityVariant(ticket.prioridade)}`}>
                                                {ticket.prioridade}
                                            </span>
                                        </td>
                                        <td>{ticket.id ? ticket.id.substring(0, 8) : 'N/A'}</td>
                                        <td>{ticket.titulo || '—'}</td>
                                        <td>{ticket.status || '—'}</td>
                                        <td>{ticket.creator?.nome || 'N/A'}</td>
                                        <td>{ticket.technician?.nome || 'Nenhum'}</td>
                                        <td>{ticket.School?.nome || 'N/A'}</td> 
                                        <td>{ticket.School?.endereco || 'N/A'}</td>
                                        <td>{ticket.createdAt ? new Date(ticket.createdAt).toLocaleDateString('pt-BR') : '—'}</td>
                                        <td>
                                            <Button variant="info" size="sm" onClick={() => handleShowDetails(ticket)}>
                                                Detalhes
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>
                </Card.Body>
            </Card>

            {/* MODAL DE GERENCIAMENTO */}
            {selectedTicket && (
                <FormularioSolicitacao 
                    show={showDetailsModal} 
                    handleClose={() => setShowDetailsModal(false)}
                    ticketData={selectedTicket}
                    isEditable={true} // Admin pode editar status/resolução
                    onUpdate={fetchTickets}
                />
            )}
        </div>
    );
};

export default PainelTicketsAdmin;
