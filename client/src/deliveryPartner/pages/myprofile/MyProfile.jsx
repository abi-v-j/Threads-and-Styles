import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProfile = () => {
    const did = sessionStorage.getItem('did');
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!did) return;
        axios.get(`http://localhost:5000/deliverypartner/${did}`)
             .then(res => setProfile(res.data.data))
             .catch(console.error);
    }, [did]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h3>My Profile</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Photo</td>
                        <td>
                            {profile.photo && (
                                <img src={`http://localhost:5000${profile.photo}`} alt="dp" width="120" />
                            )}
                        </td>
                    </tr>
                    <tr><td>Name</td><td>{profile.name}</td></tr>
                    <tr><td>Email</td><td>{profile.email}</td></tr>
                    <tr><td>Contact</td><td>{profile.contact || '-'}</td></tr>
                    <tr><td>Place</td><td>{profile.placeName || '-'}</td></tr>
                    <tr><td>Status</td><td>{profile.status}</td></tr>
                </tbody>
            </table>
        </div>
    );
};

export default MyProfile;