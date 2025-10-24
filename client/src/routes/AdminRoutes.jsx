import React from 'react'
import { Route, Routes } from 'react-router-dom'
import District from '../admin/pages/district/District'
import Place from '../admin/pages/place/Place'
import LandingPage from '../admin/pages/landing/LandingPage'
import Type from '../admin/pages/type/Type'
import Category from '../admin/pages/category/Category'
import Subcategory from '../admin/pages/subcategory/Subcategory'
import Brand from '../admin/pages/brand/Brand'
import Color from '../admin/pages/color/Color'
import Size from '../admin/pages/size/Size'
import Admin from '../admin/pages/admin/Admin'

const AdminRoutes = () => {
  return (
   <Routes>
    <Route  path='' element={<LandingPage/>}/>
    <Route  path='admin' element={<Admin/>}/>
    <Route  path='district' element={<District/>}/>
    <Route  path='place' element={<Place/>}/>
    <Route  path='type' element={<Type/>}/>
    <Route  path='category' element={<Category/>}/>
    <Route  path='subcategory' element={<Subcategory/>}/>
    <Route  path='brand' element={<Brand/>}/>
    <Route  path='color' element={<Color/>}/>
    <Route  path='size' element={<Size/>}/>
   </Routes>
  )
}

export default AdminRoutes