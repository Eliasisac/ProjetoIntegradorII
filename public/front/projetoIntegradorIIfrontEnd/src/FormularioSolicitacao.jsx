// src/assets/components/FormularioSolicitacao.jsx

import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const FormularioSolicitacao = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg" dialogClassName="modal-right">
            <Modal.Header closeButton>
                <div className="d-flex align-items-center">
                    <img src="/LogodaEmpresa.png" alt="Logo" style={{ width: '136px', height: '125px' }} className="me-2" />
                    <h5 className="mb-0 ms-2">Solicitação</h5>
                </div>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>ID Chamado</Form.Label>
                            <Form.Control type="text" placeholder="318" disabled />
                        </Col>
                        <Col>
                            <Form.Label>Escola</Form.Label>
                            <Form.Control type="text" placeholder="Francisco" disabled />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Data Abertura</Form.Label>
                            <Form.Control type="text" placeholder="29/09/2025" disabled />
                        </Col>
                        <Col>
                            <Form.Label>Prioridade</Form.Label>
                            <Form.Control type="text" placeholder="E.E. Geraldo Torrano" disabled />
                        </Col>
                        <Col>
                            <Form.Label>Marca</Form.Label>
                            <Form.Control type="text" placeholder="Thinkcat" disabled />
                        </Col>
                    </Row>
                    <Row className="mb-3">
                        <Col>
                            <Form.Label>Solicitante</Form.Label>
                            <Form.Control type="text" placeholder="Matheus" disabled />
                        </Col>
                        <Col>
                            <Form.Label>Status</Form.Label>
                            <Form.Control type="text" placeholder="Encerrado" disabled />
                        </Col>
                    </Row>
                    <Form.Group className="mb-3">
                        <Form.Label>Descrição</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Computador com Hd Cheio" disabled />
                    </Form.Group>
                    <hr />
                    <div className="mb-3">
                        <p className="mb-0">Elias Isac</p>
                        <small className="text-muted">29/09/2025 – 16:26</small>
                    </div>
                    <Form.Group>
                        <Form.Label>Resolução</Form.Label>
                        <Form.Control as="textarea" rows={3} placeholder="Realizado acesso Remoto e foi resolvido a tratativa" />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>Encerrar</Button>
                <Button variant="primary">Responder</Button>
            </Modal.Footer>
        </Modal>
    );
};

export default FormularioSolicitacao;