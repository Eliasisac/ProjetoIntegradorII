// src/assets/components/FormularioNovoChamado.jsx
import React, { useState, useEffect } from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './usuario.css'; // Importa o CSS personalizado

const FormularioNovoChamado = ({ show, handleClose }) => {
    const [equipamentos, setEquipamentos] = useState([]);
    const [novoChamado, setNovoChamado] = useState({
        titulo: '',
        descricao: '',
        prioridade: '',
        equipmentId: '',
        cidade: '', // Novo campo para a cidade
    });

    useEffect(() => {
        const fetchEquipamentos = async () => {
            const token = localStorage.getItem('token');
            if (!token) return;

            try {
                const response = await fetch('http://localhost:5000/api/equipamentos', {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (!response.ok) {
                    throw new Error('Erro ao buscar equipamentos');
                }
                const data = await response.json();
                setEquipamentos(data.equipamentos);
            } catch (error) {
                console.error("Erro ao buscar equipamentos:", error);
            }
        };

        if (show) {
            fetchEquipamentos();
        }
    }, [show]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNovoChamado(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Lógica para enviar os dados para a API
        console.log("Novo chamado enviado:", novoChamado);

        const token = localStorage.getItem('token');
        try {
            const response = await fetch('http://localhost:5000/api/tickets', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoChamado)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erro ao criar chamado');
            }

            // Chamado criado com sucesso
            handleClose(); // Fecha o modal
            alert('Chamado criado com sucesso!');
            window.location.reload(); // Recarrega a página para atualizar a lista de chamados
        } catch (error) {
            console.error("Erro:", error.message);
            alert(`Erro ao criar chamado: ${error.message}`);
        }
    };

    return (
        <Modal show={show} onHide={handleClose} size="lg" dialogClassName="modal-right">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center">
                    <img src="/LogodaEmpresa.png" alt="Logo" style={{ width: '136px', height: '125px' }} className="me-2" />
                    <h5 className="mb-0 ms-2">Abrir Novo Chamado</h5>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Título</Form.Label>
                        <Form.Control
                            type="text"
                            name="titulo"
                            value={novoChamado.titulo}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Prioridade</Form.Label>
                        <Form.Select
                            name="prioridade"
                            value={novoChamado.prioridade}
                            onChange={handleChange}
                            required
                        >
                            <option value="">Selecione a Prioridade</option>
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                        </Form.Select>
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Cidade</Form.Label>
                        <Form.Control
                            type="text"
                            name="cidade"
                            value={novoChamado.cidade}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Equipamento (Descrição Opcional)</Form.Label>
                        <Form.Control
                            type="text"
                            name="nomeEquipamento"
                            value={novoChamado.nomeEquipamento}
                            onChange={handleChange}
                            placeholder="Ex: Computador 5, Impressora Epson"
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição Detalhada</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={5}
                            name="descricao"
                            value={novoChamado.descricao}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" className="w-100 mt-3">
                        Enviar Chamado
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default FormularioNovoChamado;