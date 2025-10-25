import axios from "axios";
import React, { useEffect, useState } from "react";

const Subcategory = () => {
  const [subcategories, setSubcategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editId, setEditId] = useState(null);

  /* ----------  DATA LOADING  ---------- */
  const fetchTypes = async () => {
    const res = await axios.get("http://localhost:5000/type");
    setTypes(res.data.results);
  };

  const fetchCategories = async (id) => {
    setCategoryId(id);
    const res = await axios.get(`http://localhost:5000/subcategoryByCategory/${id}`);
    setCategories(res.data.results);
  };

  const fetchSubcategories = async () => {
    const res = await axios.get("http://localhost:5000/subcategory");
    setSubcategories(res.data.results);
  };

  useEffect(() => {
    fetchTypes();
        fetchSubcategories();

  }, []);
  

  /* ----------  CRUD  ---------- */
  const save = async () => {
    const payload = { name, categoryId };
    let res;
    if (editId) {
      res = await axios.put(
        `http://localhost:5000/subcategory/${editId}`,
        payload
      );
    } else {
      res = await axios.post("http://localhost:5000/subcategory", payload);
    }
    setSubcategories(res.data.results);
    setName("");
    setEditId(null);
  };

  const del = async (id) => {
    const res = await axios.delete(`http://localhost:5000/subcategory/${id}`);
    setSubcategories(res.data.results);
  };

  const startEdit = (r) => {
    setName(r.subcategoryName);
    setCategoryId(r.categoryId);
    setEditId(r.subcategoryId);
  };

  const handleClear = () => {
    setName("");
    setEditId(null);
  };

  /* ----------  RENDER  ---------- */
  return (
    <>
      {/* FORM TABLE */}
      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ borderCollapse: "collapse", marginBottom: "2rem" }}
      >
        <tbody>
          <tr>
            <td>Type</td>
            <td>
              <select
                value={typeId}
                onChange={(e) => {
                  setTypeId(e.target.value);
                  setCategoryId("");
                }}
              >
                <option value="">-- all types --</option>
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
                onChange={(e) => fetchCategories(e.target.value)}
              >
                <option value="">-- all categories --</option>
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
              <input
                placeholder="Subcategory name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}>
              <button onClick={save}>{editId ? "Update" : "Save"}</button>
              {editId && <button onClick={handleClear}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>

      {/* DATA TABLE */}
      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Subcategory</th>
            <th>Category</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((r) => (
            <tr key={r.subcategoryId}>
              <td>{r.subcategoryName}</td>
              <td>{r.categoryName}</td>
              <td>
                <button onClick={() => startEdit(r)}>Edit</button>
                <button onClick={() => del(r.subcategoryId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Subcategory;
