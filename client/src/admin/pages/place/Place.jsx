import axios from "axios";
import React, { useEffect, useState } from "react";

const Place = () => {
  const [places, setPlaces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [name, setName] = useState("");
  const [districtId, setDistrictId] = useState("");
  const [editId, setEditId] = useState(null);

  const fetchPlaces = async () => {
    const res = await axios.get("http://localhost:5000/place");
    setPlaces(res.data.results);
  };

  const fetchDistricts = async () => {
    const res = await axios.get("http://localhost:5000/district");
    setDistricts(res.data.results);
  };

  useEffect(() => {
    fetchPlaces();
    fetchDistricts();
  }, []);

  const save = async () => {
    const payload = { name, districtId };
    let res;
    if (editId) {
      res = await axios.put(`http://localhost:5000/place/${editId}`, payload);
    } else {
      res = await axios.post("http://localhost:5000/place", payload);
    }
    setPlaces(res.data.results);
    setName("");
    setDistrictId("");
    setEditId(null);
  };

  const del = async (id) => {
    const res = await axios.delete(`http://localhost:5000/place/${id}`);
    setPlaces(res.data.results);
  };

  const startEdit = (r) => {
    setName(r.placeName);
    setDistrictId(r.districtId);
    setEditId(r.placeId);
  };

  const handleClear = () => {
    setName("");
    setDistrictId("");
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
            <td>Place</td>
            <td>
              <input
                placeholder="Place name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </td>
          </tr>
          <tr>
            <td>District</td>
            <td>
              <select
                value={districtId}
                onChange={(e) => setDistrictId(e.target.value)}
              >
                <option value="">-- select district --</option>
                {districts.map((d) => (
                  <option key={d.districtId} value={d.districtId}>
                    {d.districtName}
                  </option>
                ))}
              </select>
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
            <th>Place</th>
            <th>District</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {places.map((r) => (
            <tr key={r.placeId}>
              <td>{r.placeName}</td>
              <td>{r.districtName}</td>
              <td>
                <button onClick={() => startEdit(r)}>Edit</button>
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
