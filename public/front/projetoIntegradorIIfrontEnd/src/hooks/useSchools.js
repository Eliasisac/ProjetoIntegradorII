import { useState, useEffect } from 'react';

const API_BASE = 'http://localhost:5000/api';

const useSchools = () => {
    const [schools, setSchools] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchSchools = async () => {
        setLoading(true);
        setError(null);
        const token = localStorage.getItem('token');
        try {
            const response = await fetch(`${API_BASE}/schools`, { 
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Falha ao buscar lista de escolas.');
            }
            const data = await response.json();
            setSchools(data.map(school => ({ id: school.id, nome: school.nome })));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSchools();
    }, []);

    return { schools, loading, error, refetch: fetchSchools };
};

export default useSchools;
