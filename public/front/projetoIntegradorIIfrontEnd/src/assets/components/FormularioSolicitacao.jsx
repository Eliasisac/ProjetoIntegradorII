// src/assets/components/FormularioSolicitacao.jsx
import React from 'react';
import { Modal, Form, Button, Row, Col } from 'react-bootstrap';
import 'bootstrap-icons/font/bootstrap-icons.css';

const FormularioSolicitacao = ({ show, handleClose }) => {
    return (
        <Modal show={show} onHide={handleClose} size="lg" dialogClassName="modal-right">
            <Modal.Header closeButton>
                <Modal.Title>Solicitação</Modal.Title>
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
                    {/* Exemplo de seção de resolução - você pode adaptá-la */}
                    <Form.Group className="mb-3">
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