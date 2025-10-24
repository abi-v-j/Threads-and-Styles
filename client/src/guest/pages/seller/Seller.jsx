import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SellerReg = () => {
    const [name, setName]           = useState('');
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [address, setAddress]     = useState('');
    const [photo, setPhoto]         = useState(null);
    const [proof, setProof]         = useState(null);
    const [logo, setLogo]           = useState(null);
    const [slogan, setSlogan]       = useState('');
    const [districts, setDistricts] = useState([]);
    const [places, setPlaces]       = useState([]);
    const [districtId, setDistrictId] = useState('');
    const [placeId, setPlaceId]     = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/district').then(r => setDistricts(r.data.data));
    }, []);

    useEffect(() => {
        if (!districtId) { setPlaces([]); setPlaceId(''); return; }
        axios.get(`http://localhost:5000/place`).then(r => {
            setPlaces(r.data.data.filter(p => p.districtId === districtId));
        });
    }, [districtId]);

    const handleSubmit = () => {
        const fd = new FormData();
        fd.append('name', name);
        fd.append('email', email);
        fd.append('password', password);
        fd.append('address', address);
        fd.append('slogan', slogan);
        fd.append('placeId', placeId);
        if (photo) fd.append('photo', photo);
        if (proof) fd.append('proof', proof);
        if (logo)  fd.append('logo', logo);

        axios.post('http://localhost:5000/seller', fd)
             .then(() => alert('Seller registered'))
             .catch(console.error);
    };

    return (
        <div style={{ padding: 20 }}>
            <h3>Seller Registration</h3>
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
                        <td>Address</td>
                        <td><input value={address} onChange={e => setAddress(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Slogan</td>
                        <td><input value={slogan} onChange={e => setSlogan(e.target.value)} /></td>
                    </tr>
                    <tr>
                        <td>Photo</td>
                        <td><input type="file" onChange={e => setPhoto(e.target.files[0])} /></td>
                    </tr>
                    <tr>
                        <td>Proof</td>
                        <td><input type="file" onChange={e => setProof(e.target.files[0])} /></td>
                    </tr>
                    <tr>
                        <td>Logo</td>
                        <td><input type="file" onChange={e => setLogo(e.target.files[0])} /></td>
                    </tr>
                    <tr>
                        <td>District</td>
                        <td>
                            <select value={districtId} onChange={e => setDistrictId(e.target.value)}>
                                <option value="">-- select --</option>
                                {districts.map(d =>
                                    <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                                )}
                            </select>
                        </td>
                    </tr>
                    <tr>
                        <td>Place</td>
                        <td>
                            <select value={placeId} onChange={e => setPlaceId(e.target.value)} disabled={!districtId}>
                                <option value="">-- select --</option>
                                {places.map(p =>
                                    <option key={p.placeId} value={p.placeId}>{p.placeName}</option>
                                )}
                            </select>
                        </td>
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

export default SellerReg;