import axios from "axios";
import React, { useEffect, useState } from "react";

const Brand = () => {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/brand");
    setRows(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editId) {
      await axios.put(`http://localhost:5000/brand/${editId}`, { name });
    } else {
      await axios.post("http://localhost:5000/brand", { name });
    }
    setName(""); setEditId(null); load();
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:5000/brand/${id}`);
    load();
  };

  return (
    <>
      <table border="1" cellPadding="6">
        <tbody>
          <tr>
            <td><input placeholder="Brand name" value={name} onChange={(e) => setName(e.target.value)} /></td>
            <td>
              <button onClick={save}>{editId ? "Update" : "Save"}</button>
              {editId && <button onClick={() => { setEditId(null); setName(""); }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>

      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Brand</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.brandId}>
              <td>{r.brandName}</td>
              <td>
                <button onClick={() => { setName(r.brandName); setEditId(r.brandId); }}>Edit</button>
                <button onClick={() => del(r.brandId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Brand;