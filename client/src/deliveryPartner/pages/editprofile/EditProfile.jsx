import React, { useEffect, useState } from 'react';
import axios from 'axios';

const EditProfile = () => {
    const did = sessionStorage.getItem('did');
    if (!did) return null;

    const [name, setName]       = useState('');
    const [email, setEmail]     = useState('');
    const [contact, setContact] = useState('');
    const [photo, setPhoto]     = useState(null);
   
    const [prevPhoto, setPrevPhoto]     = useState('');
  
    /* load current profile */
    useEffect(() => {
        axios.get(`http://localhost:5000/deliverypartner/${did}`)
             .then(res => {
                 const p = res.data.data;
                 setName(p.name);
                 setEmail(p.email);
                 setContact(p.contact || '');
                 setPrevPhoto(p.photo   ? `http://localhost:5000${p.photo}`   : '');
              
             })
             .catch(console.error);
    }, [did]);

    /* save */
    const handleSave = () => {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('contact', contact);
        if (photo)   fd.append('photo', photo);
     

        axios.put(`http://localhost:5000/deliverypartner/${did}`, fd)
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
                            {prevPhoto && <img src={prevPhoto} alt="pic" width="120" />}
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