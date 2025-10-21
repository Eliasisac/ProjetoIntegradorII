// src/PainelEscolas.jsx

import React, { useState, useEffect } from 'react';
import { Container, Table, Button, Modal, Form, Alert, Spinner, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const API_BASE = 'http://localhost:5000/api';

const initialSchoolState = { id: null, nome: '', endereco: '', telefone: '', email: '', cnpj: '' };

const SchoolTable = ({ data, handleEdit, handleDelete }) => (
    <Table hover responsive striped>
        <thead className="table-dark">
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Endereço</th>
                <th>Telefone</th>
                <th>Email</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {data.map(item => (
                <tr key={item.id}>
                    <td>{item.id.substring(0, 8)}</td>
                    <td>{item.nome}</td>
                    <td>{item.endereco}</td>
                    <td>{item.telefone}</td>
                    <td>{item.email}</td>
                    <td>
                        <Button variant="warning" size="sm" className="me-2" onClick={() => handleEdit(item)}>
                            Editar
                        </Button>
                        <Button variant="danger" size="sm" onClick={() => handleDelete(item.id)}>
                            Remover
                        </Button>
                    </td>
                </tr>
            ))}
        </tbody>
    </Table>
);


const SchoolFormModal = ({ show, handleClose, school, onSave, isEditing }) => {
    const currentSchool = school || initialSchoolState; 
    
    const [formData, setFormData] = useState(currentSchool);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        setFormData(currentSchool);
        setError(null);
    }, [school, show]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const method = isEditing ? 'PUT' : 'POST';
        const url = isEditing ? `${API_BASE}/schools/${formData.id}` : `${API_BASE}/schools`;

        const payload = { ...formData };
        
        if (!isEditing) {
            delete payload.id; 
        }

        try {
            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(payload) 
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao ${isEditing ? 'editar' : 'adicionar'} escola.`);
            }

            onSave();
            handleClose();
            alert(`Item ${isEditing ? 'atualizado' : 'criado'} com sucesso!`);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>{isEditing ? 'Editar Escola' : 'Adicionar Nova Escola'}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    <Form.Group className="mb-3">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" name="nome" value={formData.nome || ''} onChange={handleChange} required />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Endereço</Form.Label>
                        <Form.Control type="text" name="endereco" value={formData.endereco || ''} onChange={handleChange} required />
                    </Form.Group>
                    <Row>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Telefone</Form.Label>
                                <Form.Control type="text" name="telefone" value={formData.telefone || ''} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group className="mb-3">
                                <Form.Label>Email</Form.Label>
                                <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                            </Form.Group>
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>CNPJ (Opcional)</Form.Label>
                        <Form.Control type="text" name="cnpj" value={formData.cnpj || ''} onChange={handleChange} />
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


const PainelEscolas = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editingSchool, setEditingSchool] = useState(initialSchoolState); 
    const [isEditing, setIsEditing] = useState(false);

    const fetchSchools = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole'); 
        
        if (!token || userRole !== 'admin') {
            setError('Acesso negado. Token ou permissão de Admin ausente.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_BASE}/schools`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.status === 403) {
                 setError('Acesso Negado. Você não possui permissão de Administrador.');
                 setLoading(false);
                 return;
             }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao buscar escolas.');
            }
            const data = await response.json();
            setSchools(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    const handleEdit = (school) => {
        setEditingSchool(school || initialSchoolState); 
        setIsEditing(!!school && !!school.id); 
        setShowModal(true);
    };
    
    // Função para deletar
    const handleDelete = async (id) => {
        if (!window.confirm('Tem certeza que deseja excluir esta escola?')) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE}/schools/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao excluir escola.');
            }
            fetchSchools(); 
            alert('Escola removida com sucesso!');
        } catch (err) {
            alert(`Erro ao deletar: ${err.message}`);
        }
    };
    
    // Função para abrir o modal de criação
    const handleAddNew = () => {
        handleEdit(initialSchoolState); 
    };


    if (loading) return <Spinner animation="border" className="m-5" />;
    
    return (
        <div className="p-4"> 
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>Gerenciamento de Escolas</h4>
                <Button variant="success" onClick={handleAddNew}>
                    <i className="bi bi-plus-circle me-2"></i> Adicionar Nova
                </Button>
            </div>
            
            {error && <Alert variant="danger" className="mb-4">Erro: {error}</Alert>}
            
            <SchoolTable 
                data={schools} 
                handleEdit={handleEdit} 
                handleDelete={handleDelete} 
            />
            
            <SchoolFormModal 
                show={showModal} 
                handleClose={() => setShowModal(false)} 
                school={editingSchool} 
                onSave={fetchSchools}
                isEditing={isEditing}
            />
        </div>
    );
};

export default PainelEscolas;