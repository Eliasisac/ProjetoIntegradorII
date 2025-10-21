// src/FormularioSolicitacao.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Image } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_BASE = 'http://localhost:5000/api';

const formatDateTime = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }) 
         + ' – ' 
         + date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
};

const getPriorityColor = (prioridade) => {
    switch (prioridade) {
        case 'alta': return 'text-danger';
        case 'media': return 'text-warning';
        case 'baixa': return 'text-success';
        default: return 'text-secondary';
    }
};

const FormularioSolicitacao = ({ show, handleClose, ticketData, isEditable, onUpdate }) => {
    const [resolution, setResolution] = useState(ticketData?.resolucao || '');
    const [status, setStatus] = useState(ticketData?.status || 'aberto');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (ticketData) {
            setResolution(ticketData.resolucao || '');
            setStatus(ticketData.status || 'aberto');
        }
    }, [ticketData]);

    if (!ticketData) {
        return null;
    }

    const handleResolutionChange = (e) => { setResolution(e.target.value); };
    const handleStatusChange = (e) => { setStatus(e.target.value); };

    const handleUpdate = async (newStatus) => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const finalStatus = newStatus || status;

        try {
            const payload = { status: finalStatus, resolucao: resolution };

            const response = await fetch(`${API_BASE}/tickets/${ticketData.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao atualizar chamado.');
            }

            if (onUpdate) onUpdate();
            handleClose();
            
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };
    
    const getEquipmentBrand = () => {
        return ticketData.Equipment?.brand || 'N/A'; 
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" dialogClassName="modal-right">
            <Modal.Header closeButton className="border-bottom p-4 bg-light"> 
                <div className="d-flex align-items-center">
                    {}
                    <Image src="/LogodaEmpresa.png" alt="Logo" style={{ width: '40px', height: '40px' }} className="me-3" />
                    <h5 className="mb-0 fw-bold text-dark">
                        Chamado #{ticketData.id.substring(0, 8)}
                        <small className={`ms-3 fw-bold ${getPriorityColor(ticketData.prioridade)}`}>
                            ({ticketData.prioridade?.toUpperCase()})
                        </small>
                    </h5>
                </div>
            </Modal.Header>
            <Modal.Body className="p-4">
                {error && <Alert variant="danger">{error}</Alert>}
                <Form>
                    
                    {/* Dados Básicos */}
                    <Row className="mb-3">
                        <Col md={6}>
                            <Form.Label className="fw-bold text-muted">Solicitante</Form.Label>
                            <Form.Control type="text" value={ticketData.creator?.nome || 'N/A'} disabled />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="fw-bold text-muted">Escola</Form.Label>
                            <Form.Control type="text" value={ticketData.School?.nome || 'N/A'} disabled />
                        </Col>
                    </Row>
                    
                    {/* Status e Atribuição */}
                    <Row className="mb-4">
                        <Col md={6}>
                            <Form.Label className="fw-bold text-muted">Técnico Responsável</Form.Label>
                            <Form.Control type="text" value={ticketData.technician?.nome || 'Nenhum'} disabled />
                        </Col>
                        <Col md={6}>
                            <Form.Label className="fw-bold text-muted">Status</Form.Label>
                            {isEditable ? (
                                <Form.Select value={status} onChange={handleStatusChange} disabled={loading}>
                                    <option value="aberto">Aberto</option>
                                    <option value="em andamento">Em Andamento</option>
                                    <option value="resolvido">Resolvido</option>
                                    <option value="fechado">Fechado</option>
                                </Form.Select>
                            ) : (
                                <Form.Control type="text" value={ticketData.status?.toUpperCase() || 'N/A'} disabled />
                            )}
                        </Col>
                    </Row>

                    <hr className="my-4"/>
                    
                    {/* Descrição e Detalhes */}
                    <Form.Group className="mb-4">
                        <h6 className="fw-bold text-dark">Detalhes do Chamado</h6>
                        <Row className="mb-3">
                            <Col md={6}>
                                <Form.Label className="fw-bold text-muted">Equipamento/Marca</Form.Label>
                                <Form.Control type="text" value={getEquipmentBrand()} disabled />
                            </Col>
                            <Col md={6}>
                                <Form.Label className="fw-bold text-muted">Aberto em</Form.Label>
                                <Form.Control type="text" value={formatDateTime(ticketData.createdAt)} disabled />
                            </Col>
                        </Row>
                        <Form.Label className="fw-bold text-muted">Descrição Completa</Form.Label>
                        <Form.Control as="textarea" rows={4} value={ticketData.descricao} disabled />
                    </Form.Group>
                    
                    {/* Seção de Resolução */}
                    <hr className="my-4" />
                    
                    <h6 className="fw-bold text-dark mb-3">Resolução do Atendimento</h6>
                    
                    {ticketData.technician && 
                        <small className="text-muted d-block mb-3">Última atualização: {formatDateTime(ticketData.updatedAt)}</small>
                    }
                    
                    <Form.Group>
                        <Form.Label>Anotações/Resolução</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={4} 
                            placeholder={isEditable ? "Descreva a solução aplicada ou o progresso..." : "Resolução ainda não informada."} 
                            value={resolution}
                            onChange={handleResolutionChange}
                            disabled={!isEditable || loading || ticketData.status === 'fechado'}
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer className="border-top justify-content-between p-3">
                 {/* Mensagem de status */}
                {!isEditable && <small className="text-danger">{ticketData.status === 'fechado' ? 'CHAMADO ENCERRADO.' : ''}</small>}

                {isEditable ? (
                    // Botões de Ação para Técnico/Admin
                    <>
                         <Button variant="secondary" onClick={handleClose}>
                            Cancelar/Fechar
                        </Button>
                        <Button variant="primary" onClick={() => handleUpdate()} disabled={loading || ticketData.status === 'fechado'}>
                            {loading ? 'Salvando...' : 'Salvar Alterações'}
                        </Button>
                         <Button variant="success" onClick={() => handleUpdate('fechado')} disabled={loading || ticketData.status === 'fechado'}>
                            {loading ? 'Encerrando...' : 'Encerrar Chamado'}
                        </Button>
                    </>
                ) : (
                    // Botão de Fechar para Cliente
                    <Button variant="secondary" onClick={handleClose}>Fechar</Button>
                )}
            </Modal.Footer>
        </Modal>
    );
};

export default FormularioSolicitacao;