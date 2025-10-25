import axios from "axios";
import React, { useEffect, useState } from "react";

const Category = () => {
  const [categories, setCategories] = useState([]);
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchCategories = async () => {
    const res = await axios.get("http://localhost:5000/category");
    setCategories(res.data.results);
  };

  const fetchTypes = async () => {
    const res = await axios.get("http://localhost:5000/type");
    setTypes(res.data.results);
  };

  useEffect(() => { fetchCategories(); fetchTypes(); }, []);

  const save = async () => {
    const payload = { name, typeId };
    let res;
    if (editId) {
      res = await axios.put(`http://localhost:5000/category/${editId}`, payload);
    } else {
      res = await axios.post("http://localhost:5000/category", payload);
    }
    setCategories(res.data.results);
    setName("");
    setTypeId("");
    setEditId(null);
  };

  const del = async (id) => {
    const res = await axios.delete(`http://localhost:5000/category/${id}`);
    setCategories(res.data.results);
  };

  const startEdit = (r) => {
    setName(r.categoryName);
    setTypeId(r.typeId);
    setEditId(r.categoryId);
  };

  const handleClear = () => {
    setName("");
    setTypeId("");
    setEditId(null);
  };

  return (
    <>
      {/* Form Table */}
      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ borderCollapse: "collapse", marginBottom: "2rem" }}
      >
        <tbody>
          <tr>
            <td>Category</td>
            <td>
              <input
                placeholder="Category name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Type</td>
            <td>
              <select
                value={typeId}
                onChange={(e) => setTypeId(e.target.value)}
              >
                <option value="">-- select type --</option>
                {types.map((t) => (
                  <option key={t.typeId} value={t.typeId}>
                    {t.typeName}
                  </option>
                ))}
              </select>
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

      {/* Data Table */}
      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Category</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((r) => (
            <tr key={r.categoryId}>
              <td>{r.categoryName}</td>
              <td>{r.typeName}</td>
              <td>
                <button onClick={() => startEdit(r)}>Edit</button>
                <button onClick={() => del(r.categoryId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Category;