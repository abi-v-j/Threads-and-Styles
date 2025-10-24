import axios from "axios";
import React, { useEffect, useState } from "react";

const Category = () => {
  const [rows, setRows] = useState([]);
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [typeId, setTypeId] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/category");
    setRows(res.data.data);
  };

  const loadTypes = async () => {
    const res = await axios.get("http://localhost:5000/type");
    setTypes(res.data.data);
  };

  useEffect(() => { load(); loadTypes(); }, []);

  const save = async () => {
    const payload = { name, typeId };
    if (editId) {
      await axios.put(`http://localhost:5000/category/${editId}`, payload);
    } else {
      await axios.post("http://localhost:5000/category", payload);
    }
    setName(""); setTypeId(""); setEditId(null); load();
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:5000/category/${id}`);
    load();
  };

  return (
    <>
      <table border="1" cellPadding="6">
        <tbody>
          <tr>
            <td><input placeholder="Category name" value={name} onChange={(e) => setName(e.target.value)} /></td>
            <td>
              <select value={typeId} onChange={(e) => setTypeId(e.target.value)}>
                <option value="">-- select type --</option>
                {types.map((t) => (
                  <option key={t.typeId} value={t.typeId}>{t.typeName}</option>
                ))}
              </select>
            </td>
            <td>
              <button onClick={save}>{editId ? "Update" : "Save"}</button>
              {editId && <button onClick={() => { setEditId(null); setName(""); setTypeId(""); }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>

      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Category</th><th>Type</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.categoryId}>
              <td>{r.categoryName}</td>
              <td>{r.typeName}</td>
              <td>
                <button onClick={() => { setName(r.categoryName); setTypeId(r.typeId); setEditId(r.categoryId); }}>Edit</button>
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