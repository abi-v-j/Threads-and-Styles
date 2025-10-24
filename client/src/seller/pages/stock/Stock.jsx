import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const Stock = () => {
  const { productId } = useParams();
  const navigate = useNavigate();

  /* dropdown lists */
  const [colors, setColors] = useState([]);
  const [sizes, setSizes] = useState([]);

  /* chosen values */
  const [colorId, setColorId] = useState("");
  const [productColorId, setProductColorId] = useState(""); // real ProductColor _id
  const [sizeId, setSizeId] = useState("");
  const [quantity, setQuantity] = useState(1);

  /* on mount -> colours for this product */
  useEffect(() => {
    axios
      .get(`http://localhost:5000/colorsByProduct/${productId}`)
      .then((res) => setColors(res.data.data))
      .catch((err) =>
        alert(err.response?.data?.error || "Failed to load colours")
      );
  }, [productId]);

  /* when colour changes -> find ProductColor row + load sizes */
  useEffect(() => {
    if (!colorId) {
      setSizes([]);
      setSizeId("");
      setProductColorId("");
      return;
    }

    /* find ProductColor _id first */
    axios
      .get(`http://localhost:5000/productColor`) // existing route
      .then((res) => {
        const pc = res.data.data.find(
          (r) => r.productId === productId && r.colorId === colorId
        );
        if (!pc) {
          alert("Product-Color link not found");
          return;
        }
        setProductColorId(pc.productColorId);

        /* now load sizes for that productColor */
        return axios.get(
          `http://localhost:5000/sizesByProductColor/${pc.productColorId}`
        );
      })
      .then((res) => {
        console.log(res.data.data);
        
        setSizes(res.data.data);
        setSizeId("");
      })
      .catch((err) =>
        alert(err.response?.data?.error || "Failed to load sizes")
      );
  }, [colorId, productId]);

  /* save stock */
  const handleSave = () => {
    if (!productColorId || !sizeId || quantity <= 0)
      return alert("Fill all fields");
    axios
      .post("http://localhost:5000/stock", {
        productSizeId: sizeId,
        quantity: Number(quantity),
      })
      .then(() => {
        alert("Stock added");
        setQuantity(1);
        setSizeId("");
      })
      .catch((err) => alert(err.response?.data?.error || "Error"));
  };

  return (
    <div style={{ padding: 20, fontFamily: "Arial, sans-serif" }}>
      <h3>Add Stock</h3>

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
                value={colorId}
                onChange={(e) => setColorId(e.target.value)}
              >
                <option value="">-- select --</option>
                {colors.map((c) => (
                  <option key={c.colorId} value={c.colorId}>
                    {c.colorName}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          <tr>
            <td>Size</td>
            <td>
              <select
                value={sizeId}
                onChange={(e) => setSizeId(e.target.value)}
                disabled={!colorId}
              >
                <option value="">-- select --</option>
                {sizes.map((s) => (
                  <option key={s.sizeId} value={s._id}>
                    {s.sizeName}
                  </option>
                ))}
              </select>
            </td>
          </tr>

          <tr>
            <td>Quantity</td>
            <td>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
              />
            </td>
          </tr>

          <tr>
            <td colSpan="2" style={{ textAlign: "center" }}>
              <button onClick={handleSave}>Save Stock</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default Stock;
