// src/pages/ViewProduct.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/productCard") // slim endpoint
      .then((res) => {
        console.log(res.data.data);

        setProducts(res.data.data);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  if (!products.length) return <p style={{ padding: 20 }}>No products.</p>;

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h2 style={{ marginBottom: 15 }}>All Products</h2>

      {products.map((p, i) => (
        <div
          key={p.productId}
          onClick={() => navigate(`/user/viewmore/${p.productId}`)}
          style={{
            display: "flex",
            gap: 15,
            marginBottom: 20,
            border: "1px solid #ddd",
            borderRadius: 8,
            padding: 15,
            background: "#fafafa",
          }}
        >
          <img
            src={
              p.image
                ? `http://localhost:5000${p.image}`
                : "https://via.placeholder.com/140"
            }
            alt={p.name}
            style={{
              width: 140,
              height: 140,
              objectFit: "cover",
              borderRadius: 4,
            }}
          />
          <div>
            <h4 style={{ margin: "0 0 6px 0" }}>
              {i + 1}. {p.name}
            </h4>
            <p style={{ margin: 0, color: "#555", fontSize: 14 }}>
              {p.details || "-"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ViewProduct;
