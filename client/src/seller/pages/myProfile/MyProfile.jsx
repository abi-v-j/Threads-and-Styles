import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyProfile = () => {
    const sid = sessionStorage.getItem('sid');
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        if (!sid) return;
        axios.get(`http://localhost:5000/seller/${sid}`)
             .then(res => setProfile(res.data.data))
             .catch(console.error);
    }, [sid]);

    if (!profile) return <div>Loading...</div>;

    return (
        <div style={{ padding: 20 }}>
            <h3>My Profile</h3>
            <table border="1" cellPadding="8">
                <tbody>
                    <tr>
                        <td>Logo</td>
                        <td>
                            {profile.logo && (
                                <img src={`http://localhost:5000${profile.logo}`} alt="logo" width="120" />
                            )}
                        </td>
                    </tr>
                    <tr><td>Name</td><td>{profile.name}</td></tr>
                    <tr><td>Email</td><td>{profile.email}</td></tr>
                    <tr><td>Address</td><td>{profile.address || '-'}</td></tr>
                    <tr><td>Slogan</td><td>{profile.slogan || '-'}</td></tr>
                    <tr><td>Place</td><td>{profile.placeName || '-'}</td></tr>
                    
                </tbody>
            </table>
        </div>
    );
};

export default MyProfile;