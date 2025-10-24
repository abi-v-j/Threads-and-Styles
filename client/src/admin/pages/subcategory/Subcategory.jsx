import axios from "axios";
import React, { useEffect, useState } from "react";

const Subcategory = () => {
  const [rows, setRows] = useState([]);
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/subcategory");
    setRows(res.data.data);
  };

  const loadCategories = async () => {
    const res = await axios.get("http://localhost:5000/category");
    setCategories(res.data.data);
  };

  useEffect(() => {
    load();
    loadCategories();
  }, []);

  const save = async () => {
    const payload = { name, categoryId };
    if (editId) {
      await axios.put(`http://localhost:5000/subcategory/${editId}`, payload);
    } else {
      await axios.post("http://localhost:5000/subcategory", payload);
    }
    setName("");
    setCategoryId("");
    setEditId(null);
    load();
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:5000/subcategory/${id}`);
    load();
  };

  return (
    <>
      <table border="1" cellPadding="6">
        <tbody>
          <tr>
            <td>
              <input
                placeholder="Subcategory name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
            <td>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
              >
                <option value="">-- select category --</option>
                {categories.map((c) => (
                  <option key={c.categoryId} value={c.categoryId}>
                    {c.categoryName}
                  </option>
                ))}
              </select>
            </td>
            <td>
              <button onClick={save}>{editId ? "Update" : "Save"}</button>
              {editId && (
                <button
                  onClick={() => {
                    setEditId(null);
                    setName("");
                    setCategoryId("");
                  }}
                >
                  Cancel
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Subcategory</th>
            <th>Category</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.subcategoryId}>
              <td>{r.subcategoryName}</td>
              <td>{r.categoryName}</td>
              <td>
                <button
                  onClick={() => {
                    setName(r.subcategoryName);
                    setCategoryId(r.categoryId);
                    setEditId(r.subcategoryId);
                  }}
                >
                  Edit
                </button>
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
