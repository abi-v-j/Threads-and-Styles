import axios from "axios";
import React, { useEffect, useState } from "react";

const Admin = () => {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/admin");
    setRows(res.data.data);
  };

  useEffect(() => {
    load();
  }, []);

  const save = async () => {
    const payload = { name, email, password };
    if (editId) {
      await axios.put(`http://localhost:5000/admin/${editId}`, payload);
    } else {
      await axios.post("http://localhost:5000/admin", payload);
    }
    setName("");
    setEmail("");
    setPassword("");
    setEditId(null);
    load();
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:5000/admin/${id}`);
    load();
  };

  const startEdit = (r) => {
    setName(r.name);
    setEmail(r.email);
    setPassword(r.password);
    setEditId(r.adminId);
  };

  return (
    <>
      <table border="1" cellPadding="6">
        <tbody>
          <tr>
            <td>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
            <td>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </td>
            <td>
              <input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </td>
            <td>
              <button onClick={save}>{editId ? "Update" : "Save"}</button>
              {editId && (
                <button
                  onClick={() => {
                    setEditId(null);
                    setName("");
                    setEmail("");
                    setPassword("");
                  }}
                >
                  Cancel
                </button>
              )}
            </td>
          </tr>
        </tbody>
      </table>
      <br></br>
      <br></br>
      <br></br>
      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.adminId}>
              <td>{r.name}</td>
              <td>{r.email}</td>
              <td>{r.password}</td>
              <td>
                <button onClick={() => startEdit(r)}>Edit</button>
                <button onClick={() => del(r.adminId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Admin;
