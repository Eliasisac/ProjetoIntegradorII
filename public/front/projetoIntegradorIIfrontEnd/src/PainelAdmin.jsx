// src/PainelAdmin.jsx

import React, { useState, useEffect } from 'react';
import { Button, Table, Spinner, Alert, Modal, Form, Row, Col } from 'react-bootstrap';
import useSchools from './hooks/useSchools'; 

const API_BASE = 'http://localhost:5000/api';

const UserTable = ({ data, handleEdit, handleDelete }) => (
    <Table hover responsive striped>
        <thead className="table-dark">
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Email</th>
                <th>Role</th>
                <th>School ID</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {data.map(item => (
                <tr key={item.id}>
                    <td>{item.id.substring(0, 8)}</td>
                    <td>{item.nome}</td>
                    <td>{item.email}</td>
                    <td>{item.role}</td>
                    <td>{item.schoolId ? item.schoolId.substring(0, 8) : 'N/A'}</td>
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

const EquipmentTable = ({ data, handleEdit, handleDelete }) => (
    <Table hover responsive striped>
        <thead className="table-dark">
            <tr>
                <th>ID</th>
                <th>Nome</th>
                <th>Marca</th>
                <th>Status</th>
                <th>Tipo</th>
                <th>Ações</th>
            </tr>
        </thead>
        <tbody>
            {data.map(item => (
                <tr key={item.id}>
                    <td>{item.id.substring(0, 8)}</td>
                    <td>{item.name}</td>
                    <td>{item.brand}</td>
                    <td>{item.status}</td>
                    <td>{item.type}</td>
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


const PainelAdmin = ({ view }) => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [editItem, setEditItem] = useState(null);
    const isUserView = view === 'users';
    const endpoint = isUserView ? 'users' : 'equipments';
    const title = isUserView ? 'Gerenciamento de Usuários' : 'Gerenciamento de Equipamentos';

    const { schools, loading: loadingSchools, error: errorSchools, refetch } = useSchools();

    const fetchData = async () => {
        setLoading(true);
        const token = localStorage.getItem('token');
        const userRole = localStorage.getItem('userRole');
        
        if (!token || userRole !== 'admin') {
            setError('Acesso negado. Token ou permissão de Admin ausente.');
            setLoading(false);
            return;
        }

        try {
            // Garante que o hook de escolas recarregue junto com os dados da tabela
            refetch(); 

            const response = await fetch(`${API_BASE}/${endpoint}`, {
                headers: { 'Authorization': `Bearer ${token}` } 
            });
            
            if (response.status === 403) {
                 setError('Acesso Negado. Você não possui permissão de Administrador.');
                 setLoading(false);
                 return;
            }
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `Erro ao buscar ${title}`);
            }
            
            const result = await response.json();
            setData(result); 

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [view]);

    const handleEdit = (item) => {
        setEditItem(item);
        setShowModal(true);
    };

    const handleDelete = async (itemId) => {
        if (!window.confirm(`Tem certeza que deseja remover este item?`)) return;

        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE}/${endpoint}/${itemId}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) throw new Error('Falha ao deletar.');
            
            fetchData();
            alert('Item removido com sucesso!');
        } catch (err) {
            alert(`Erro ao deletar: ${err.message}`);
        }
    };

    if (loading) return <Spinner animation="border" className="m-5" />;
    if (error || errorSchools) return <Alert variant="danger" className="m-5">Erro: {error || errorSchools}</Alert>;

    return (
        <div className="p-4">
            <div className="d-flex justify-content-between align-items-center mb-4">
                <h4>{title}</h4>
                <Button variant="success" onClick={() => handleEdit(null)}>
                    <i className="bi bi-plus-circle me-2"></i> Adicionar Novo
                </Button>
            </div>
            
            {isUserView ? (
                <UserTable data={data} handleEdit={handleEdit} handleDelete={handleDelete} />
            ) : (
                <EquipmentTable data={data} handleEdit={handleEdit} handleDelete={handleDelete} />
            )}
            
            <AdminEditModal 
                show={showModal} 
                handleClose={() => setShowModal(false)}
                item={editItem} 
                isUserView={isUserView}
                onSave={fetchData}
                schools={schools} 
                loadingSchools={loadingSchools}
            />
        </div>
    );
};

export default PainelAdmin;



const AdminEditModal = ({ show, handleClose, item, isUserView, onSave, schools, loadingSchools }) => {
    const currentItem = item || {}; 
    const isEditing = !!currentItem.id;

    const [formData, setFormData] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (currentItem.id) {
            setFormData(currentItem);
        } else {
            setFormData(isUserView ? { nome: '', email: '', role: 'client', senha: '', schoolId: '' } : { name: '', brand: '', model: '', status: 'ativo', type: '', schoolId: '' });
        }
    }, [item, show, isUserView]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        
        const endpoint = isUserView ? 'users' : 'equipments';
        const url = isEditing ? `${API_BASE}/${endpoint}/${currentItem.id}` : `${API_BASE}/${endpoint}`; 
        const method = isEditing ? 'PUT' : 'POST';
        
        const payload = { ...formData };
        if (isEditing && isUserView && !payload.senha) {
            delete payload.senha;
        }

        try {
            if (isUserView && !isEditing) {
                const registerResponse = await fetch(`${API_BASE}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });
                 if (!registerResponse.ok) {
                    const errorData = await registerResponse.json();
                    throw new Error(errorData.message || 'Erro ao registrar usuário.');
                }
            } else {
                const response = await fetch(url, {
                    method: method,
                    headers: { 
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}` 
                    },
                    body: JSON.stringify(payload)
                });
                
                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Erro ao ${isEditing ? 'atualizar' : 'criar'} item.`);
                }
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
                <Modal.Title>{isEditing ? `Editar ${isUserView ? 'Usuário' : 'Equipamento'}` : `Adicionar Novo ${isUserView ? 'Usuário' : 'Equipamento'}`}</Modal.Title>
            </Modal.Header>
            <Form onSubmit={handleSubmit}>
                <Modal.Body>
                    {error && <Alert variant="danger">{error}</Alert>}
                    
                    {/* Campos Comuns: Nome */}
                    <Form.Group className="mb-3">
                        <Form.Label>{isUserView ? 'Nome' : 'Nome do Equipamento'}</Form.Label>
                        <Form.Control 
                            type="text" 
                            name={isUserView ? 'nome' : 'name'} 
                            value={formData[isUserView ? 'nome' : 'name'] || ''} 
                            onChange={handleChange} 
                            required 
                        />
                    </Form.Group>
                    
                    {/* Dropdown de Escola */}
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

                    {/* Campos Específicos de Usuário */}
                    {isUserView && (
                        <>
                            <Row>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email" name="email" value={formData.email || ''} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
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
                            <Form.Group className="mb-3">
                                <Form.Label>Senha {isEditing && '(Deixe vazio para não alterar)'}</Form.Label>
                                <Form.Control type="password" name="senha" value={formData.senha || ''} onChange={handleChange} required={!isEditing} />
                            </Form.Group>
                        </>
                    )}
                    
                    {/* Campos Específicos de Equipamento */}
                    {!isUserView && (
                        <>
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
                                    <Form.Group className="mb-3">
                                        <Form.Label>Tipo</Form.Label>
                                        <Form.Control type="text" name="type" value={formData.type || ''} onChange={handleChange} required />
                                    </Form.Group>
                                </Col>
                                <Col md={6}>
                                    <Form.Group className="mb-3">
                                        <Form.Label>Status</Form.Label>
                                        <Form.Select name="status" value={formData.status || 'ativo'} onChange={handleChange} required disabled={loading}>
                                            <option value="ativo">Ativo</option>
                                            <option value="inativo">Inativo</option>
                                            <option value="manutencao">Manutenção</option>
                                            <option value="descartado">Descartado</option>
                                        </Form.Select>
                                    </Form.Group>
                                </Col>
                            </Row>
                        </>
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Cancelar
                    </Button>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? <Spinner as="span" animation="border" size="sm" /> : 'Salvar'}
                    </Button>
                </Modal.Footer>
            </Form>
        </Modal>
    );
};
