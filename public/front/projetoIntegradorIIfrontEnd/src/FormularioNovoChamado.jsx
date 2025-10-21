// src/FormularioNovoChamado.jsx

import React, { useState, useEffect } from 'react';
import { Modal, Button, Form, Alert } from 'react-bootstrap';

import { jwtDecode } from 'jwt-decode'; // Pega a função principal 'jwtDecode'

const API_BASE = 'http://localhost:5000/api';

const FormularioNovoChamado = ({ show, handleClose, onTicketCreated }) => {
    const [formData, setFormData] = useState({
        titulo: '',
        descricao: '',
        prioridade: 'media',
        equipmentId: ''
    });
    const [equipments, setEquipments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [userSchoolId, setUserSchoolId] = useState(null);

    useEffect(() => {
        if (!show) return;

        const token = localStorage.getItem('token');
        if (token) {
            try {
                const decoded = jwt_decode(token);
                setUserSchoolId(decoded.schoolId);
            } catch (e) {
                console.error("Erro ao decodificar token:", e);
                return;
            }
        }
        
        const fetchEquipments = async () => {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE}/equipments`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                
                if (!response.ok) throw new Error('Falha ao carregar equipamentos.');
                
                const data = await response.json();
                
                const filteredEquipments = data.filter(eq => eq.schoolId === userSchoolId);
                
                setEquipments(filteredEquipments);
            } catch (err) {
                setError('Não foi possível carregar a lista de equipamentos.');
            } finally {
                setLoading(false);
            }
        };

        if (userSchoolId) {
             fetchEquipments();
        }
    }, [show, userSchoolId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');

        try {
            const payload = {
                titulo: formData.titulo,
                descricao: formData.descricao,
                prioridade: formData.prioridade,
                equipmentId: formData.equipmentId || null
            };
            
            const response = await fetch(`${API_BASE}/tickets`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}` 
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar chamado.');
            }

            onTicketCreated();
            setFormData({ titulo: '', descricao: '', prioridade: 'media', equipmentId: '' });
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
                <Modal.Title>Abrir Novo Chamado</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control 
                            type="text" 
                            name="titulo" 
                            value={formData.titulo} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição Detalhada</Form.Label>
                        <Form.Control 
                            as="textarea" 
                            rows={3} 
                            name="descricao" 
                            value={formData.descricao} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Prioridade</Form.Label>
                        <Form.Select 
                            name="prioridade" 
                            value={formData.prioridade} 
                            onChange={handleChange}
                        >
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>Equipamento Relacionado (Opcional)</Form.Label>
                        <Form.Select 
                            name="equipmentId" 
                            value={formData.equipmentId} 
                            onChange={handleChange}
                            disabled={loading}
                        >
                            <option value="">Nenhum Equipamento</option>
                            {equipments.map(eq => (
                                <option key={eq.id} value={eq.id}>
                                    {eq.name} ({eq.model})
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Criando...' : 'Abrir Chamado'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};

export default FormularioNovoChamado;