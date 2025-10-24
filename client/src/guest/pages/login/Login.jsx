import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleLogin = () => {
        
        axios.post('http://localhost:5000/login/', { email, password })
            .then(res => {
                const { role, id, name, message } = res.data;
                alert(message);

                /* ---------- role-based routing ---------- */
                if (role === 'user') {
                    sessionStorage.setItem('uid', id);
                    sessionStorage.setItem('userName', name);
                    navigate('/user/home');
                } else if (role === 'seller') {
                    sessionStorage.setItem('sid', id);
                    sessionStorage.setItem('sellerName', name);
                    navigate('/seller/home');
                } else if (role === 'admin') {
                    sessionStorage.setItem('aid', id);
                    sessionStorage.setItem('adminName', name);
                    navigate('/admin/home');
                } else if (role === 'deliveryBoy') {
                    sessionStorage.setItem('did', id);
                    sessionStorage.setItem('deliveryBoyName', name);
                    navigate('/delivery/home');
                }
            })
            .catch(() => alert('Login failed'));
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Login</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Email</td>
                        <td><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td colSpan="2" align="center"><button onClick={handleLogin}>Login</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default Login;