import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Gallery = () => {
  const { productId } = useParams();

  const [colors, setColors] = useState([]);
  const [productColorId, setProductColorId] = useState("");
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* load colours for this product */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/colorsByProductForGallery/${productId}`)
      .then((res) => {
        console.log(res.data.data);

        setColors(res.data.data);
      })
      .catch((err) =>
        alert(err.response?.data?.error || "Failed to load colours")
      );
  }, [productId]);

  /* handle multi-file pick */
  const handleFileChange = (e) => setFiles([...e.target.files]);

  /* upload all files in ONE request */
  const handleUpload = () => {
    if (!productColorId || files.length === 0)
      return alert("Choose colour and at least one image");
    setUploading(true);

    const fd = new FormData();
    files.forEach((f) => fd.append("file", f)); // key must match backend: "file"
    fd.append("productColorId", productColorId);

    axios
      .post("http://localhost:5000/gallery", fd)
      .then((res) => {
        alert(`${res.data.data.length} images uploaded`);
        setFiles([]);
        setProductColorId("");
        document.getElementById("file-input").value = "";
      })
      .catch((err) => alert(err.response?.data?.error || "Upload failed"))
      .finally(() => setUploading(false));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h3>Manage Gallery</h3>

      <table
        border="1"
        cellPadding="8"
        style={{ width: "100%", maxWidth: 600 }}
      >
        <tbody>
          <tr>
            <td>Product ID</td>
            <td>{productId}</td>
          </tr>

          <tr>
            <td>Colour</td>
            <td>
              <select
                value={productColorId}
                onChange={(e) => setProductColorId(e.target.value)}
              >
                <option value="">-- select --</option>
                {colors.map((c) => (
                  <option key={c.productColorId} value={c.productColorId}>
                    {c.colorName}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          <tr>
            <td>Images</td>
            <td>
              <input
                id="file-input"
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
              />
            </td>
          </tr>

          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}>
              <button onClick={handleUpload} disabled={uploading}>
                {uploading ? "Uploading..." : "Upload Images"}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Gallery;
