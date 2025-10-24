import React, { useEffect, useState } from 'react';
import axios from 'axios';

const UserReg = () => {
    const [name, setName]           = useState('');
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [photo, setPhoto]         = useState(null);
    const [contact, setContact]     = useState('');
    const [gender, setGender]       = useState('');

    const handleSubmit = () => {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('password', password);
        fd.append('contact', contact);
        fd.append('gender', gender);
        if (photo) fd.append('photo', photo);

        axios.post('http://localhost:5000/user', fd)
             .then(() => alert('User registered'))
             .catch(console.error);
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>User Registration</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Name</td>
                        <td><input value={name} onChange={e => setName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Password</td>
                        <td><input type="password" value={password} onChange={e => setPassword(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Contact</td>
                        <td><input value={contact} onChange={e => setContact(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Gender</td>
                        <td>
                            <select value={gender} onChange={e => setGender(e.target.value)}>
                                <option value="">-- select --</option>
                                <option value="Male">Male</option>
                                <option value="Female">Female</option>
                                <option value="Other">Other</option>
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Photo</td>
                        <td><input type="file" onChange={e => setPhoto(e.target.files[0])} /></td>
                    </tr>
                    <tr>
                        <td colSpan="2" align="center">
                            <button onClick={handleSubmit}>Register</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default UserReg;