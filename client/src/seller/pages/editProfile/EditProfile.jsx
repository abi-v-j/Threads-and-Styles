import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
    const sid = sessionStorage.getItem('sid');
    if (!sid) return null;

    const [name, setName]           = useState('');
    const [email, setEmail]         = useState('');
    const [address, setAddress]     = useState('');
    const [slogan, setSlogan]       = useState('');
    const [photo, setPhoto]         = useState(null);
    const [logo, setLogo]           = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState('');
    const [previewLogo, setPreviewLogo]   = useState('');

    /* load current profile */
    useEffect(() => {
        axios.get(`http://localhost:5000/seller/${sid}`)
             .then(res => {
                 const s = res.data.data;
                 setName(s.name);
                 setEmail(s.email);
                 setAddress(s.address || '');
                 setSlogan(s.slogan || '');
                 setPreviewPhoto(s.photo ? `http://localhost:5000${s.photo}` : '');
                 setPreviewLogo(s.logo ? `http://localhost:5000${s.logo}` : '');
             })
             .catch(console.error);
    }, [sid]);

    /* save */
    const handleSave = () => {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('address', address);
        fd.append('slogan', slogan);
        if (photo) fd.append('photo', photo);
        if (logo)  fd.append('logo', logo);

        axios.put(`http://localhost:5000/seller/${sid}`, fd)
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
                            {previewPhoto && <img src={previewPhoto} alt="seller" width="120" />}
                            <input type="file" onChange={e => setPhoto(e.target.files[0])} />
                        </td>
                    </tr>
                    <tr>
                        <td>Logo</td>
                        <td>
                            {previewLogo && <img src={previewLogo} alt="logo" width="120" />}
                            <input type="file" onChange={e => setLogo(e.target.files[0])} />
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
                        <td>Address</td>
                        <td><input value={address} onChange={e => setAddress(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Slogan</td>
                        <td><input value={slogan} onChange={e => setSlogan(e.target.value)} /></td>
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