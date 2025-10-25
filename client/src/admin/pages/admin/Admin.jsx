import axios from "axios";
import { useEffect, useState } from "react";

const Admin = () => {
  const [admins, setAdmins] = useState([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchAdmins = async () => {
    const res = await axios.get("http://localhost:5000/admin");
    setAdmins(res.data.results);
  };

  useEffect(() => {
    fetchAdmins();
  }, []);

  const save = async () => {
    const payload = { name, email, password };
    let res;
    if (editId) {
      res = await axios.put(`http://localhost:5000/admin/${editId}`, payload);
    } else {
      res = await axios.post("http://localhost:5000/admin", payload);
    }
    setAdmins(res.data.results);
    setName("");
    setEmail("");
    setPassword("");
    setEditId(null);
  };

  const del = async (id) => {
    const res = await axios.delete(`http://localhost:5000/admin/${id}`);
    setAdmins(res.data.results);
  };

  const startEdit = (r) => {
    setName(r.name);
    setEmail(r.email);
    setPassword(r.password);
    setEditId(r.adminId);
  };

  const handleClear = () => {
    setName("");
    setEmail("");
    setPassword("");
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
            <td>Name</td>
            <td>
              <input
                placeholder="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Email</td>
            <td>
              <input
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>Password</td>
            <td>
              <input
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
            <th>Name</th>
            <th>Email</th>
            <th>Password</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((r) => (
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
