import { Route, Routes } from "react-router-dom";
import LandingPage from "../seller/pages/landing/LandingPage";
import MyProfile from "../seller/pages/myprofile/MyProfile";
import ChangePassword from "../seller/pages/changepassword/ChangePassword";
import EditProfile from "../seller/pages/editprofile/EditProfile";
import Product from "../seller/pages/product/Product";
import ViewProduct from "../seller/pages/product/ViewProduct";
import ProductSize from "../seller/pages/productSize/ProductSize";
import Stock from "../seller/pages/stock/Stock";
import Gallery from "../seller/pages/gallery/Gallery";

const SellerRoutes = () => {
  return (
    <Routes>
      <Route path="" element={<LandingPage />} />
      <Route path="myprofile" element={<MyProfile />} />
      <Route path="changepassword" element={<ChangePassword />} />
      <Route path="editprofile" element={<EditProfile />} />
      <Route path="product" element={<Product />} />
      <Route path="viewproduct" element={<ViewProduct />} />
      <Route path="productsize/:id" element={<ProductSize />} />
      <Route path="stock/:productId" element={<Stock />} />
      <Route path="gallery/:productId" element={<Gallery />} />
    </Routes>
  );
};

export default SellerRoutes;
