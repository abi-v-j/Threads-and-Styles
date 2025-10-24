import React from 'react'
import AdminRoutes from '../../routes/AdminRoutes'
import Navbar from '../components/navbar/Navbar'

const Dashboard = () => {
  return (
    <div>
      <Navbar/>
      <AdminRoutes/>
    </div>
  )
}

export default Dashboard