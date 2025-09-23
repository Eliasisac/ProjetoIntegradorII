// src/components/Dashboard.jsx
import React, { useState } from 'react';
import { Button, Container, Row, Col, Table, Form } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './Dashboard.css'; // Importa o CSS específico para este componente

const Dashboard = () => {
    // Estado para controlar o colapso da sidebar
    const [isCollapsed, setIsCollapsed] = useState(false);

    const toggleSidebar = () => {
        setIsCollapsed(!isCollapsed);
    };

    return (
        <Container fluid>
            <Row>
                {/* Sidebar */}
                <Col className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>
                    <h2>
                        <i className="bi bi-grid" onClick={toggleSidebar} style={{ cursor: 'pointer' }}></i>
                        <span> Menu</span>
                    </h2>
                    <a href="#"><i className="bi bi-clock-history"></i> <span>Prioridades</span></a>
                    <a href="#"><i className="bi bi-list-task"></i> <span>Solicitações Pendentes</span></a>
                </Col>

                {/* Conteúdo principal */}
                <Col className={`content ${isCollapsed ? 'expanded' : ''}`}>
                    <h4>
                        Solicitações Pendentes <br />
                        <h5><small className="text-muted">Setembro 2025</small></h5>
                    </h4>

                    <div className="d-flex gap-2 mb-3">
                        <Button variant="primary">Total de Chamados</Button>
                        <Button className="pri-baixa">Prioridade Baixa</Button>
                        <Button className="pri-media">Prioridade Média</Button>
                        <Button className="pri-alta">Prioridade Alta</Button>
                    </div>

                    <div className="d-flex gap-2 mb-3 flex-wrap">
                        <Form.Select className="w-auto" id="selectAno">
                            <option value="2025" selected>2025</option>
                            {/* ... outras opções */}
                        </Form.Select>
                        <Form.Select className="w-auto" id="selectMes">
                            <option value="9" selected>Setembro</option>
                            {/* ... outras opções */}
                        </Form.Select>
                        <Form.Select className="w-auto" id="selectPrioridade">
                            <option value="">Prioridades</option>
                            {/* ... outras opções */}
                        </Form.Select>
                        <Form.Select className="w-auto" id="selectCidade">
                            <option value="">Cidade</option>
                            {/* ... outras opções */}
                        </Form.Select>
                        <Form.Select className="w-auto" id="selectMarca">
                            <option value="">Marca</option>
                            {/* ... outras opções */}
                        </Form.Select>
                    </div>

                    <div className="table-responsive">
                        <Table hover>
                            <thead className="table-dark">
                                <tr>
                                    <th>ID</th>
                                    <th>Prioridade</th>
                                    <th>Tema</th>
                                    <th>Solicitante</th>
                                    <th>Data de Abertura</th>
                                    <th>Cidade</th>
                                    <th>Marca</th>
                                </tr>
                            </thead>
                            <tbody id="listaChamados"></tbody>
                        </Table>
                    </div>
                </Col>
            </Row>
        </Container>
    );
};

export default Dashboard;