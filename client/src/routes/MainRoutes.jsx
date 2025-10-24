import React from 'react'
import { Route, Routes } from 'react-router-dom'

import Dashboard from '../admin/dashboard/Dashboard'
import GuestHome from '../guest/home/HomePage'
import UserHome from '../user/home/HomePage'
import SellerHome from '../seller/home/HomePage'
import DeliveryHome from '../deliveryPartner/home/HomePage'

const MainRoutes = () => {
  return (
   <Routes>
    <Route  path='admin/*' element={<Dashboard/>}/>
    <Route  path='guest/*' element={<GuestHome/>}/>
    <Route  path='user/*' element={<UserHome/>}/>
    <Route  path='seller/*' element={<SellerHome/>}/>
    <Route  path='delivery/*' element={<DeliveryHome/>}/>
   </Routes>
  )
}

export default MainRoutes