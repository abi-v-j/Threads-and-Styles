import axios from "axios";
import React, { useEffect, useState } from "react";

const Type = () => {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/type");
    setRows(res.data.data);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    if (editId) {
      await axios.put(`http://localhost:5000/type/${editId}`, { name });
    } else {
      await axios.post("http://localhost:5000/type", { name });
    }
    setName(""); setEditId(null); load();
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:5000/type/${id}`);
    load();
  };

  return (
    <>
      <table border="1" cellPadding="6">
        <tbody>
          <tr>
            <td><input placeholder="Type name" value={name} onChange={(e) => setName(e.target.value)} /></td>
            <td>
              <button onClick={save}>{editId ? "Update" : "Save"}</button>
              {editId && <button onClick={() => { setEditId(null); setName(""); }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>

      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Type</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.typeId}>
              <td>{r.typeName}</td>
              <td>
                <button onClick={() => { setName(r.typeName); setEditId(r.typeId); }}>Edit</button>
                <button onClick={() => del(r.typeId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Type;