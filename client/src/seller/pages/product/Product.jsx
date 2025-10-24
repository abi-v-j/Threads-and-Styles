import React, { useEffect, useState } from "react";
import axios from "axios";

const Product = () => {
  /* ---------- form fields ---------- */
  const [name, setName] = useState("");
  const [details, setDetails] = useState("");
  const [brandId, setBrandId] = useState("");
  const [typeId, setTypeId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subcategoryId, setSubcategoryId] = useState("");

  /* ---------- dropdown lists ---------- */
  const [brands, setBrands] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);

  /* ---------- colours ---------- */
  const [colors, setColors] = useState([]);
  const [checkedColors, setCheckedColors] = useState([]);

  const sellerId = sessionStorage.getItem("sid");

  /* ---------- fetch static lists ---------- */
  useEffect(() => {
    axios
      .get("http://localhost:5000/brand")
      .then((res) => setBrands(res.data.data));
    axios
      .get("http://localhost:5000/type")
      .then((res) => setTypes(res.data.data));
    axios
      .get("http://localhost:5000/color")
      .then((res) => setColors(res.data.data));
  }, []);

  /* ---------- fetch categories when type changes ---------- */
  useEffect(() => {
    if (!typeId) {
      setCategories([]);
      setCategoryId("");
      return;
    }
    axios.get(`http://localhost:5000/categoryByType/${typeId}`).then((res) => {
      setCategories(res.data.data);
      setCategoryId("");
    });
  }, [typeId]);

  /* ---------- fetch subcategories when category changes ---------- */
  useEffect(() => {
    if (!categoryId) {
      setSubcategories([]);
      setSubcategoryId("");
      return;
    }
    axios
      .get(`http://localhost:5000/subcategoryByCategory/${categoryId}`)
      .then((res) => {
        setSubcategories(res.data.data);
        setSubcategoryId("");
      });
  }, [categoryId]);

  /* ---------- checkbox handler ---------- */
  const handleColorCheck = (colorId) => {
    setCheckedColors((prev) =>
      prev.includes(colorId)
        ? prev.filter((id) => id !== colorId)
        : [...prev, colorId]
    );
  };

  /* ---------- submit ---------- */
  const handleSubmit = () => {
    if (!sellerId) return alert("Seller not logged in");
    const payload = {
      name,
      details,
      brandId,
      subcategoryId,
      sellerId,
      colorIds: checkedColors,
    };
    axios
      .post("http://localhost:5000/product", payload)
      .then(() => {
        alert("Product added");
        setName("");
        setDetails("");
        setBrandId("");
        setTypeId("");
        setCategoryId("");
        setSubcategoryId("");
        setCheckedColors([]);
      })
      .catch((err) => alert(err.response?.data?.error || "Error"));
  };

  /* ---------- UI ---------- */
  return (
    <div style={{ padding: 20 }}>
      <h3>Add Product</h3>
      <table border="1" cellPadding="8">
        <tbody>
          <tr>
            <td>Name</td>
            <td>
              <input value={name} onChange={(e) => setName(e.target.value)} />
            </td>
          </tr>
          <tr>
            <td>Details</td>
            <td>
              <textarea
                value={details}
                onChange={(e) => setDetails(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Brand</td>
            <td>
              <select
                value={brandId}
                onChange={(e) => setBrandId(e.target.value)}
              >
                <option value="">-- select --</option>
                {brands.map((b) => (
                  <option key={b.brandId} value={b.brandId}>
                    {b.brandName}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          {/* ----- TYPE ----- */}
          <tr>
            <td>Type</td>
            <td>
              <select
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
              >
                <option value="">-- select --</option>
                {types.map((t) => (
                  <option key={t.typeId} value={t.typeId}>
                    {t.typeName}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          <tr>
            <td>Category</td>
            <td>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                disabled={!typeId}
              >
                <option value="">-- select --</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>Subcategory</td>
            <td>
              <select
                value={subcategoryId}
                onChange={(e) => setSubcategoryId(e.target.value)}
                disabled={!categoryId}
              >
                <option value="">-- select --</option>
                {subcategories.map((sc) => (
                  <option key={sc.subcategoryId} value={sc.subcategoryId}>
                    {sc.subcategoryName}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          {/* ----- COLOURS ----- */}
          <tr>
            <td>Colours</td>
            <td>
              {colors.map((c) => (
                <label key={c.colorId} style={{ marginRight: 12 }}>
                  <input
                    type="checkbox"
                    checked={checkedColors.includes(c.colorId)}
                    onChange={() => handleColorCheck(c.colorId)}
                  />
                  {c.colorName}
                </label>
              ))}
            </td>
          </tr>

          <tr>
            <td colSpan="2" align="center">
              <button onClick={handleSubmit}>Save Product</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Product;
