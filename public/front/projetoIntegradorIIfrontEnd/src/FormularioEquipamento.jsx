// src/components/FormularioEquipamento.jsx (Para edição/criação de equipamento)

import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import useSchools from '../hooks/useSchools'; 

const API_BASE = 'http://localhost:5000/api';

// Estados iniciais para criação
const initialEquipmentState = { id: null, name: '', brand: '', model: '', status: 'ativo', type: '', schoolId: '' };

const FormularioEquipamento = ({ show, handleClose, equipmentData, onSave }) => {
    const currentItem = equipmentData || initialEquipmentState;
    const isEditing = !!currentItem.id;

    const [formData, setFormData] = useState(currentItem);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Carrega a lista de escolas
    const { schools, loading: loadingSchools, error: errorSchools } = useSchools();

    useEffect(() => {
        setFormData(currentItem);
        setError(null);
    }, [equipmentData, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        const url = isEditing ? `${API_BASE}/equipments/${currentItem.id}` : `${API_BASE}/equipments`;
        const method = isEditing ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} equipamento.`);
            }

            onSave();
            handleClose();
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Editar Equipamento' : 'Adicionar Novo Equipamento'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {(error || errorSchools) && <Alert variant="danger">{error || errorSchools}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Nome do Equipamento</Form.Label>
                        <Form.Control type="text" name="name" value={formData.name || ''} onChange={handleChange} required />
                    </Form.Group>
                    
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Marca</Form.Label>
                                <Form.Control type="text" name="brand" value={formData.brand || ''} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Modelo</Form.Label>
                                <Form.Control type="text" name="model" value={formData.model || ''} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                    </Row>

                    <Row>
                        <Col md={6}>
                            {/* Dropdown de Escolas */}
                            <Form.Group className="mb-3">
                                <Form.Label>Escola Onde Está Localizado</Form.Label>
                                <Form.Select 
                                    name="schoolId" 
                                    value={formData.schoolId || ''} 
                                    onChange={handleChange} 
                                    required
                                    disabled={loadingSchools || loading} 
                                >
                                    <option value="">
                                        {loadingSchools ? 'Carregando Escolas...' : 'Selecione a Escola'}
                                    </option>
                                    {schools.map((school) => (
                                        <option key={school.id} value={school.id}>
                                            {school.nome}
                                        </option>
                                    ))}
                                </Form.Select>
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Tipo</Form.Label>
                                <Form.Control type="text" name="type" value={formData.type || ''} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Status</Form.Label>
                        <Form.Select name="status" value={formData.status || 'ativo'} onChange={handleChange} required disabled={loading}>
                            <option value="ativo">Ativo</option>
                            <option value="inativo">Inativo</option>
                            <option value="manutencao">Manutenção</option>
                            <option value="descartado">Descartado</option>
                        </Form.Select>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>Cancelar</Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default FormularioEquipamento;