import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const ViewMore = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5000/productOne/${id}`)
      .then(res => setProduct(res.data.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p style={{ padding: 20 }}>Loading…</p>;
  if (!product)   return <p style={{ padding: 20 }}>Product not found.</p>;

  /* first gallery picture for hero */
  const hero = product.colours?.[0]?.gallery?.[0]?.file
    ? `http://localhost:5000${product.colours[0].gallery[0].file}`
    : "https://via.placeholder.com/400x300?text=No+Image";

  return (
    <div style={{ maxWidth: 900, margin: "20px auto", padding: 20, fontFamily: "Arial" }}>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
        {/* pictures */}
        <div style={{ flex: "1 1 300px" }}>
          <img src={hero} alt={product.name} style={{ width: "100%", borderRadius: 8 }} />
          <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto" }}>
            {product.colours?.map(c =>
              c.gallery?.map((pic, i) => (
                <img
                  key={i}
                  src={`http://localhost:5000${pic.file}`}
                  alt={c.colorName}
                  style={{ height: 80, width: 80, objectFit: "cover", borderRadius: 4, border: "1px solid #ddd" }}
                />
              ))
            )}
          </div>
        </div>

        {/* info */}
        <div style={{ flex: "1 1 300px" }}>
          <h1>{product.name}</h1>
          <p style={{ color: "#555" }}>
            {product.brandName} • {product.categoryName} • {product.typeName}
          </p>
          <p style={{ marginTop: 10 }}>{product.details}</p>

          <h3 style={{ marginTop: 20 }}>Colours & Sizes</h3>
          {product.colours?.map(c => (
            <div key={c.colorId} style={{ marginBottom: 10 }}>
              <b>{c.colorName}</b>
              <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 4 }}>
                {c.sizes?.map(s => (
                  <span key={s._id} style={{ padding: "4px 8px", border: "1px solid #ccc", borderRadius: 4, fontSize: 13 }}>
                    {s.sizeName} ({s.stocks?.reduce((a,b) => a + (b.quantity || 0), 0) || 0})
                  </span>
                ))}
              </div>
            </div>
          ))}

          <button style={{ marginTop: 25, padding: "10px 20px", background: "#007bff", color: "#fff", border: "none", borderRadius: 4 }}>
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewMore;