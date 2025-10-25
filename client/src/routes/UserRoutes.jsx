import React from 'react'
import HomePage from '../user/home/HomePage'
import { Route, Routes } from 'react-router-dom'
import MyProfile from '../user/pages/myProfile/MyProfile'
import EditProfile from '../user/pages/editProfile/EditProfile'
import ChangePassword from '../user/pages/changePassword/ChangePassword'
import ViewProduct from '../user/pages/viewProduct/ViewProduct'
import ViewMore from '../user/pages/viewMore/ViewMore'

const UserRoutes = () => {
    return (
        <Routes>
            <Route path='home' element={<HomePage />} />
            <Route path='myprofile' element={<MyProfile />} />
            <Route path='editprofile' element={<EditProfile />} />
            <Route path='changepassword' element={<ChangePassword />} />
            <Route path='viewproduct' element={<ViewProduct />} />
            <Route path='viewmore/:id' element={<ViewMore />} />
        </Routes>
    )
}

export default UserRoutes