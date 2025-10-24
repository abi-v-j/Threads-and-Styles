import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Login from '../guest/pages/login/Login'
import SellerReg from '../guest/pages/seller/Seller'
import DeliverPartnerReg from '../guest/pages/deliverPartner/DeliveryPartner'
import UserReg from '../guest/pages/user/User'

const GuestRoutes = () => {
    return (
        <Routes>
            <Route path='user' element={<UserReg />} />
             <Route path='seller' element={<SellerReg />} />
             <Route path='delivery' element={<DeliverPartnerReg />} />
            <Route path='login' element={<Login />} />
        </Routes>)
}

export default GuestRoutes