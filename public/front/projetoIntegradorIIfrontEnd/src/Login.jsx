
// src/Login.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './assets/LogodaEmpresa.png';
import { Container, Row, Col, Card, Form, Button, Image } from 'react-bootstrap';

function Login() {
    const [formData, setFormData] = useState({ email: '', senha: '' });
    const navigate = useNavigate();
    const [error, setError] = useState('');

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // ... (sua lógica de login permanece a mesma)
        try {
            const response = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token);
                navigate('/solicitacoes');
            } else {
                setError(data.message || 'Falha no login');
            }
        } catch (err) {
            setError('Falha de rede');
        }
    };

   return (
        <Container fluid className="d-flex justify-content-center align-items-center width:839 height:528 position-relative">
            <Row className="login-box shadow-lg">
                <Col className="bg-white p-4 rounded-start d-flex flex-column justify-content-center align-items-center text-center">
                    <Form onSubmit={handleSubmit} className="mt-5 w-75">
                        {error && <p className="text-danger">{error}</p>}
                        <Form.Group className="mb-3 w-100" controlId="formBasicEmail">
                            <Form.Control type="email" name="email" value={formData.email} onChange={handleChange} placeholder="Email" />
                        </Form.Group>
                        <Form.Group className="mb-3 w-100" controlId="formBasicPassword">
                            <Form.Control type="password" name="senha" value={formData.senha} onChange={handleChange} placeholder="Senha" />
                        </Form.Group>
                        <Button variant="primary" type="submit" className="w-100">Entrar</Button>
                    </Form>
                </Col>
                <Col className="bg-primary text-white p-4 d-flex flex-column align-items-center justify-content-center text-center login-info-col">
                    <Image src={logo} alt="Logo" style={{ width: '136px', height: '125px' }} />
                    <p className="mt-4">Não possui acesso? Entre em contato com a nossa equipe</p>
                    {/* Alterar para variant="outline-primary" para borda azul ou manter outline-light para borda branca */}
                    <Button variant="outline-light" className="w-100">Solicitar</Button> 
                </Col>
            </Row>
        </Container>
    );
}

export default Login;