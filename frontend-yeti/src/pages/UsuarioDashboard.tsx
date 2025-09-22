import React from 'react';
import { useNavigate } from 'react-router-dom';

const UsuarioDashboard: React.FC = () => {
    const navigate = useNavigate();
    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #eff3f4 0%, #f3fafd 50%, #ddf1fa 100%)',
            fontFamily: 'Source Sans Pro, sans-serif'
        }}>
            <div style={{
                textAlign: 'center',
                padding: '2rem',
                background: 'rgba(255, 255, 255, 0.9)',
                borderRadius: '1rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                maxWidth: '600px',
                margin: '0 1rem'
            }}>
                <h1 style={{
                    color: '#217093',
                    fontSize: '2.5rem',
                    marginBottom: '1rem',
                    fontWeight: '700'
                }}>
                    👤 Área do Usuário
                </h1>

                <p style={{
                    color: '#4a7d5c',
                    fontSize: '1.2rem',
                    marginBottom: '2rem',
                    lineHeight: '1.6'
                }}>
                    Bem-vindo à sua área pessoal!
                </p>

                <div style={{
                    background: '#f3fafd',
                    padding: '1.5rem',
                    borderRadius: '0.5rem',
                    border: '2px solid #4eb8dd',
                    marginBottom: '2rem'
                }}>
                    <h2 style={{
                        color: '#217093',
                        fontSize: '1.5rem',
                        marginBottom: '1rem'
                    }}>
                        🚧 Em Desenvolvimento
                    </h2>
                    <p style={{
                        color: '#4a7d5c',
                        fontSize: '1rem',
                        margin: 0
                    }}>
                        Trabalharemos nessa página em breve!
                    </p>
                </div>

                <button
                    onClick={() => {
                        localStorage.removeItem('yeti_token');
                        localStorage.removeItem('yeti_user');
                        navigate('/');
                    }}
                    style={{
                        background: '#4eb8dd',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 2rem',
                        borderRadius: '0.5rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        cursor: 'pointer',
                        transition: 'background-color 0.3s ease'
                    }}
                    onMouseOver={(e) => e.currentTarget.style.background = '#217093'}
                    onMouseOut={(e) => e.currentTarget.style.background = '#4eb8dd'}
                >
                    Fazer Logout
                </button>
            </div>
        </div>
    );
};

export default UsuarioDashboard;
