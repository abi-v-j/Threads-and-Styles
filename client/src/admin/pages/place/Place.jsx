import axios from "axios";
import React, { useEffect, useState } from "react";

const Place = () => {
  const [rows, setRows] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [name, setName] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [editId, setEditId] = useState(null);

  const load = async () => {
    const res = await axios.get("http://localhost:5000/place");
    setRows(res.data.data);
  };

  const loadDistricts = async () => {
    const res = await axios.get("http://localhost:5000/district");
    setDistricts(res.data.data);
  };

  useEffect(() => { load(); loadDistricts(); }, []);

  const save = async () => {
    const payload = { name, districtId };
    if (editId) {
      await axios.put(`http://localhost:5000/place/${editId}`, payload);
    } else {
      await axios.post("http://localhost:5000/place", payload);
    }
    setName(""); setDistrictId(""); setEditId(null); load();
  };

  const del = async (id) => {
    await axios.delete(`http://localhost:5000/place/${id}`);
    load();
  };

  return (
    <>
      <table border="1" cellPadding="6">
        <tbody>
          <tr>
            <td><input placeholder="Place name" value={name} onChange={(e) => setName(e.target.value)} /></td>
            <td>
              <select value={districtId} onChange={(e) => setDistrictId(e.target.value)}>
                <option value="">-- select district --</option>
                {districts.map((d) => (
                  <option key={d.districtId} value={d.districtId}>{d.districtName}</option>
                ))}
              </select>
            </td>
            <td>
              <button onClick={save}>{editId ? "Update" : "Save"}</button>
              {editId && <button onClick={() => { setEditId(null); setName(""); setDistrictId(""); }}>Cancel</button>}
            </td>
          </tr>
        </tbody>
      </table>

      <table border="1" cellPadding="6">
        <thead>
          <tr><th>Place</th><th>District</th><th>Action</th></tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.placeId}>
              <td>{r.placeName}</td>
              <td>{r.districtName}</td>
              <td>
                <button onClick={() => { setName(r.placeName); setDistrictId(r.districtId); setEditId(r.placeId); }}>Edit</button>
                <button onClick={() => del(r.placeId)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

export default Place;