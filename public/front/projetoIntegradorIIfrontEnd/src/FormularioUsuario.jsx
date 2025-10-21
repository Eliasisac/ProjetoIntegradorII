// src/components/FormularioUsuario.jsx (Para edição/criação de usuário)

import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col, Alert, Spinner } from 'react-bootstrap';
import useSchools from '../hooks/useSchools'; 

const API_BASE = 'http://localhost:5000/api';

const initialUserState = { nome: '', email: '', senha: '', role: 'client', schoolId: '' };

const FormularioUsuario = ({ show, handleClose, userData, onSave }) => {
    const currentItem = userData || initialUserState;
    const isEditing = !!currentItem.id;

    const [formData, setFormData] = useState(currentItem);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Carrega a lista de escolas
    const { schools, loading: loadingSchools, error: errorSchools } = useSchools();

    useEffect(() => {
        setFormData(currentItem);
        setError(null);
    }, [userData, show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        let url = isEditing ? `${API_BASE}/users/${currentItem.id}` : `${API_BASE}/auth/register`;
        const method = isEditing ? 'PUT' : 'POST';
        
        const payload = { ...formData };
        if (isEditing && !payload.senha) {
            delete payload.senha;
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} usuário.`);
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
                <Modal.Title>{isEditing ? 'Editar Usuário' : 'Adicionar Novo Usuário'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {(error || errorSchools) && <Alert variant="danger">{error || errorSchools}</Alert>}

                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Senha {isEditing && '(Deixe vazio para não alterar)'}</Form.Label>
                        <Form.Control type="password" name="senha" value={formData.senha || ''} onChange={handleChange} required={!isEditing} />
                    </Form.Group>
                    
                    <Row>
                        <Col md={6}>
                            {/* Dropdown de Escolas */}
                            <Form.Group className="mb-3">
                                <Form.Label>Escola</Form.Label>
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
                            {/* Dropdown de Função */}
                            <Form.Group className="mb-3">
                                <Form.Label>Função (Role)</Form.Label>
                                <Form.Select name="role" value={formData.role || 'client'} onChange={handleChange} required disabled={loading}>
                                    <option value="client">Client (Usuário Comum)</option>
                                    <option value="technician">Technician</option>
                                    <option value="admin">Admin</option>
                                </Form.Select>
                            </Form.Group>
                        </Col>
                    </Row>

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

export default FormularioUsuario;