
import { Route, Routes } from 'react-router-dom'
import LandingPage from '../deliveryPartner/pages/landing/LandingPage'
import MyProfile from '../deliveryPartner/pages/myprofile/MyProfile'
import EditProfile from '../deliveryPartner/pages/editprofile/EditProfile'
import ChangePassword from '../deliveryPartner/pages/changepassword/ChangePassword'


const DeliveryPartnerRoutes = () => {
    return (
        <Routes>
            <Route path='' element={<LandingPage />} />
            <Route path='myprofile' element={<MyProfile />} />
            <Route path='editprofile' element={<EditProfile />} />
               <Route path='changepassword' element={<ChangePassword />} />
        </Routes>
    )
}

export default DeliveryPartnerRoutes