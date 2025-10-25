import axios from "axios";
import { useEffect, useState } from "react";

const District = () => {
  const [districts, setDistricts] = useState([]);
  const [name, setName] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchDistricts = async () => {
    const res = await axios.get("http://localhost:5000/district");
    setDistricts(res.data.results);
  };

  useEffect(() => { fetchDistricts(); }, []);

  const save = async () => {
    const payload = { name };
    let res;
    if (editId) {
      res = await axios.put(`http://localhost:5000/district/${editId}`, payload);
    } else {
      res = await axios.post("http://localhost:5000/district", payload);
    }
    setDistricts(res.data.results);
    setName("");
    setEditId(null);
  };

  const del = async (id) => {
    const res = await axios.delete(`http://localhost:5000/district/${id}`);
    setDistricts(res.data.results);
  };

  const startEdit = (r) => {
    setName(r.districtName);
    setEditId(r.districtId);
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
            <td>District</td>
            <td>
              <input
                placeholder="District name"
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
            <th>District</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {districts.map((r) => (
            <tr key={r.districtId}>
              <td>{r.districtName}</td>
              <td>
                <button onClick={() => startEdit(r)}>Edit</button>
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