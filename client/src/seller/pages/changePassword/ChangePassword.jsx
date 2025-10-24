import React, { useState } from 'react';
import axios from 'axios';

const ChangePassword = () => {
    const sid = sessionStorage.getItem('sid');
    const [oldPwd, setOldPwd] = useState('');
    const [newPwd, setNewPwd] = useState('');
    const [confPwd, setConfPwd] = useState('');

    const handleChange = () => {
        if (!oldPwd || !newPwd || !confPwd) return alert('All fields required');
        if (newPwd !== confPwd) return alert('New passwords do not match');

        axios.put(`http://localhost:5000/sellerPassword/${sid}`, {
            oldPassword: oldPwd,
            newPassword: newPwd
        })
        .then(res => {
            alert(res.data.message);
            setOldPwd(''); setNewPwd(''); setConfPwd('');
        })
        .catch(err => alert(err.response?.data?.message || 'Update failed'));
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Change Password</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Old Password</td>
                        <td><input type="password" value={oldPwd} onChange={e => setOldPwd(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>New Password</td>
                        <td><input type="password" value={newPwd} onChange={e => setNewPwd(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Confirm Password</td>
                        <td><input type="password" value={confPwd} onChange={e => setConfPwd(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td colSpan="2" align="center"><button onClick={handleChange}>Change</button></td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default ChangePassword;