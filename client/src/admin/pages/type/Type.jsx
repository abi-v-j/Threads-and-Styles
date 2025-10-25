import axios from "axios";
import React, { useEffect, useState } from "react";

const Type = () => {
  const [types, setTypes] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchTypes = async () => {
    const res = await axios.get("http://localhost:5000/type");
    setTypes(res.data.results);
  };

  useEffect(() => {
    fetchTypes();
  }, []);

  const save = async () => {
    const payload = { name };
    let res;
    if (editId) {
      res = await axios.put(`http://localhost:5000/type/${editId}`, payload);
    } else {
      res = await axios.post("http://localhost:5000/type", payload);
    }
    setTypes(res.data.results);
    setName("");
    setEditId(null);
  };

  const del = async (id) => {
    const res = await axios.delete(`http://localhost:5000/type/${id}`);
    setTypes(res.data.results);
  };

  const startEdit = (r) => {
    setName(r.typeName);
    setEditId(r.typeId);
  };

  const handleClear = () => {
    setName("");
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
            <td>Type</td>
            <td>
              <input
                placeholder="Type name"
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

      {/* Data Table */}
      <table
        border="1"
        cellPadding="6"
        cellSpacing="0"
        style={{ borderCollapse: "collapse" }}
      >
        <thead>
          <tr>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {types.map((r) => (
            <tr key={r.typeId}>
              <td>{r.typeName}</td>
              <td>
                <button onClick={() => startEdit(r)}>Edit</button>
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
