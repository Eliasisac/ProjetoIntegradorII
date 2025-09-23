// src/PainelSolicitacoes.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

function PainelSolicitacoes() {
    const [tickets, setTickets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTickets = async () => {
            const token = localStorage.getItem('token');
            if (!token) {
                window.location.href = '/';
                return;
            }

            try {
                const response = await fetch('http://localhost:5000/api/tickets', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erro ao buscar solicitações');
                }

                const data = await response.json();
                setTickets(data.tickets);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTickets();
    }, []);

    if (loading) return <div style={{ padding: '20px' }}>Carregando solicitações...</div>;
    if (error) return <div style={{ padding: '20px' }}>Erro: {error}</div>;

    // Filtros para o resumo, com base no seu PDF
    const totalTickets = tickets.length;
    const prioridadeBaixa = tickets.filter(t => t.prioridade === 'baixa').length;
    const prioridadeMedia = tickets.filter(t => t.prioridade === 'media').length;
    const prioridadeAlta = tickets.filter(t => t.prioridade === 'alta').length;

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h2>Solicitações Pendentes</h2>

            {/* Resumo dos Chamados */}
            <div style={{ display: 'flex', justifyContent: 'flex-start', gap: '10px', marginBottom: '20px', flexWrap: 'wrap' }}>
                <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    **{totalTickets}** Total de Chamados
                </div>
                <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    **{prioridadeBaixa}** Prioridade Baixa
                </div>
                <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    **{prioridadeMedia}** Prioridade Média
                </div>
                <div style={{ padding: '10px', border: '1px solid #ccc', borderRadius: '5px' }}>
                    **{prioridadeAlta}** Prioridade Alta
                </div>
                <button
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer'
                    }}
                >
                    Abrir Chamado
                </button>
            </div>

            {/* Tabela de Solicitações */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                <thead>
                    <tr style={{ backgroundColor: '#f2f2f2' }}>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>ID</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Prioridade</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Tema</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Solicitante</th>
                        <th style={{ padding: '10px', border: '1px solid #ccc' }}>Status</th>
                    </tr>
                </thead>
                <tbody>
                    {tickets.map(ticket => (
                        <tr key={ticket.id}>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ticket.id.substring(0, 8)}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ticket.prioridade}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ticket.titulo}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ticket.creator.nome}</td>
                            <td style={{ padding: '10px', border: '1px solid #ccc' }}>{ticket.status}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default PainelSolicitacoes;