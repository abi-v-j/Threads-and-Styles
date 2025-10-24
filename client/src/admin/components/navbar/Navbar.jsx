import React from "react";
import { Link } from "react-router-dom";

const Navbar = () => {
  return (
    <div>
      <Link to="/admin">Admin Home</Link>
      <Link to="/admin/district">Districts</Link>
      <Link to="/admin/place">Places</Link>
      <Link to="/admin/type">Types</Link>
      <Link to="/admin/category">Categories</Link>
      <Link to="/admin/subcategory">Subcategories</Link>
      <Link to="/admin/brand">Brands</Link>
      <Link to="/admin/color">Colors</Link>
      <Link to="/admin/size">Sizes</Link>
    </div>
  );
};

export default Navbar;
