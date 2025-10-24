import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
    const uid = sessionStorage.getItem('uid');
    if (!uid) return null;

    const [name, setName]           = useState('');
    const [email, setEmail]         = useState('');
    const [contact, setContact]     = useState('');
    const [photo, setPhoto]         = useState(null);
    const [preview, setPreview]     = useState('');

    /* load current profile */
    useEffect(() => {
        axios.get(`http://localhost:5000/user/${uid}`)
             .then(res => {
                 const u = res.data.data;
                 setName(u.name);
                 setEmail(u.email);
                 setContact(u.contact || '');
                 setPreview(u.photo ? `http://localhost:5000${u.photo}` : '');
             })
             .catch(console.error);
    }, [uid]);

    /* save */
    const handleSave = () => {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('contact', contact);
        if (photo) fd.append('photo', photo);

        axios.put(`http://localhost:5000/user/${uid}`, fd)
             .then(() => { alert('Profile updated'); window.location.reload(); })
             .catch(() => alert('Update failed'));
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Edit Profile</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Photo</td>
                        <td>
                            {preview && <img src={preview} alt="user" width="120" />}
                            <input type="file" onChange={e => setPhoto(e.target.files[0])} />
                        </td>
                    </tr>
                    <tr>
                        <td>Name</td>
                        <td><input value={name} onChange={e => setName(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Email</td>
                        <td><input type="email" value={email} onChange={e => setEmail(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Contact</td>
                        <td><input value={contact} onChange={e => setContact(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td colSpan="2" align="center">
                            <button onClick={handleSave}>Save</button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default EditProfile;