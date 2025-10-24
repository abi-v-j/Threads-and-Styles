import axios from "axios";
import React, { useEffect, useState } from "react";

const District = () => {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/district");
    setRows(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editId) {
      await axios.put(`http://localhost:5000/district/${editId}`, { name });
    } else {
      await axios.post("http://localhost:5000/district", { name });
    }
    setName(""); setEditId(null); load();
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:5000/district/${id}`);
    load();
  };

  return (
    <>
      <table border="1" cellPadding="6">
        <tbody>
          <tr>
            <td><input placeholder="District name" value={name} onChange={(e) => setName(e.target.value)} /></td>
            <td>
              <button onClick={save}>{editId ? "Update" : "Save"}</button>
              {editId && <button onClick={() => { setEditId(null); setName(""); }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>

      <table border="1" cellPadding="6">
        <thead>
          <tr><th>District</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.districtId}>
              <td>{r.districtName}</td>
              <td>
                <button onClick={() => { setName(r.districtName); setEditId(r.districtId); }}>Edit</button>
                <button onClick={() => del(r.districtId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default District;