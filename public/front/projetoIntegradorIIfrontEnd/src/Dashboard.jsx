// src/assets/components/DashboardSolicitacoes.jsx

import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';
// Importe componentes de gráfico aqui (se usar um componente de terceiros como Recharts, Chart.js etc.)

const DashboardSolicitacoes = () => {
    // Dados de exemplo para o dashboard
    const metrics = {
        total: 318,
        abertas: 45,
        emAndamento: 120,
        encerradas: 153,
        prioridadeAlta: 15,
    };

    return (
        <Container fluid className="p-4">
            <h2 className="mb-4">
                <i className="bi bi-speedometer2 me-2"></i> Dashboard de Solicitações
            </h2>

            {/* Linha de Métricas Chave (Key Metrics) */}
            <Row className="mb-4">
                {/* Cartão de Total */}
                <Col md={6} lg={3}>
                    <Card bg="primary" text="white" className="mb-3 shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h5">Total de Chamados</Card.Title>
                                    <Card.Text as="h2">{metrics.total}</Card.Text>
                                </div>
                                <i className="bi bi-ticket-detailed-fill display-4"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Cartão de Abertas */}
                <Col md={6} lg={3}>
                    <Card bg="warning" text="dark" className="mb-3 shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h5">Chamados Abertos</Card.Title>
                                    <Card.Text as="h2">{metrics.abertas}</Card.Text>
                                </div>
                                <i className="bi bi-box-seam display-4"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Cartão de Em Andamento */}
                <Col md={6} lg={3}>
                    <Card bg="info" text="white" className="mb-3 shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h5">Em Andamento</Card.Title>
                                    <Card.Text as="h2">{metrics.emAndamento}</Card.Text>
                                </div>
                                <i className="bi bi-hourglass-split display-4"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Cartão de Encerradas */}
                <Col md={6} lg={3}>
                    <Card bg="success" text="white" className="mb-3 shadow">
                        <Card.Body>
                            <div className="d-flex justify-content-between align-items-center">
                                <div>
                                    <Card.Title as="h5">Encerradas</Card.Title>
                                    <Card.Text as="h2">{metrics.encerradas}</Card.Text>
                                </div>
                                <i className="bi bi-check-circle-fill display-4"></i>
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* Linha de Visualizações/Gráficos */}
            <Row className="mb-4">
                {/* Coluna para Gráfico de Status (ex: Pizza/Donut) */}
                <Col lg={6}>
                    <Card className="shadow">
                        <Card.Header>Chamados por Status</Card.Header>
                        <Card.Body>
                            {/* Aqui entraria o componente de gráfico (Gráfico de Pizza/Barra) */}
                            <div style={{ height: '300px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                [Gráfico de Status: Aberto vs. Encerrado vs. Em Andamento]
                            </div>
                        </Card.Body>
                    </Card>
                </Col>

                {/* Coluna para Gráfico de Prioridade (ex: Barra) */}
                <Col lg={6}>
                    <Card className="shadow">
                        <Card.Header>Chamados por Prioridade</Card.Header>
                        <Card.Body>
                            {/* Aqui entraria o componente de gráfico (Gráfico de Barras) */}
                            <div style={{ height: '300px', backgroundColor: '#f8f9fa', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                                [Gráfico de Prioridade: Alta, Média, Baixa]
                            </div>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
            
            {/* Linha de Tabela ou Outras Métricas */}
            <Row>
                <Col>
                    <Card className="shadow">
                        <Card.Header>Chamados com Prioridade Alta ({metrics.prioridadeAlta})</Card.Header>
                        <Card.Body>
                            {/* Aqui entraria uma tabela de chamados recentes ou críticos */}
                            <p>Tabela de Chamados Críticos/Recentes</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default DashboardSolicitacoes;