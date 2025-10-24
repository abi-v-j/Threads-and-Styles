import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const ViewProduct = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/product")
      .then((res) => {
        setProducts(res.data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        alert("Could not load products");
        setLoading(false);
      });
  }, []);

  if (loading) return <div style={{ padding: 20 }}>Loading...</div>;
  if (products.length === 0)
    return <div style={{ padding: 20 }}>No products found.</div>;

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "20px",
        }}
      >
        <h2 style={{ margin: 0, color: "#333" }}>All Products</h2>
      </div>

      {products.map((p, idx) => (
        <div
          key={p.productId}
          style={{
            border: "1px solid #ddd",
            borderRadius: "8px",
            padding: "15px",
            marginBottom: "25px",
            backgroundColor: "#fafafa",
          }}
        >
          {/* Header section with button */}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "10px",
            }}
          >
            <h3 style={{ margin: 0, color: "#222" }}>
              {idx + 1}. {p.name} ({p.brandName})
            </h3>
            <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",}}>
              <button
                onClick={() => navigate(`/seller/productsize/${p.productId}`)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Manage Size
              </button>
              <button
                onClick={() => navigate(`/seller/stock/${p.productId}`)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Manage Stock
              </button>
               <button
                onClick={() => navigate(`/seller/gallery/${p.productId}`)}
                style={{
                  padding: "6px 12px",
                  backgroundColor: "#28a745",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: "pointer",
                }}
              >
                Manage gallery
              </button>
            </div>
          </div>

          {/* Info section */}
          <p style={{ margin: "4px 0", color: "#555" }}>
            <b>Category:</b> {p.categoryName} / {p.subcategoryName} |{" "}
            <b>Type:</b> {p.typeName}
          </p>
          <p style={{ margin: "4px 0", color: "#555" }}>
            <b>Seller:</b> {p.sellerName} | <b>Status:</b>{" "}
            <span
              style={{
                color: p.status === "Active" ? "green" : "red",
                fontWeight: "bold",
              }}
            >
              {p.status}
            </span>
          </p>
          <p style={{ margin: "4px 0", color: "#555" }}>
            <b>Details:</b> {p.details}
          </p>
          <p style={{ margin: "4px 0", fontSize: "13px", color: "#888" }}>
            <b>Created:</b> {new Date(p.createdAt).toLocaleString()} |{" "}
            <b>Updated:</b> {new Date(p.updatedAt).toLocaleString()}
          </p>

          {/* Colour & size table */}
          <table
            style={{
              width: "100%",
              marginTop: "15px",
              borderCollapse: "collapse",
              backgroundColor: "white",
            }}
          >
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2" }}>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Colour
                </th>
                <th
                  style={{
                    border: "1px solid #ccc",
                    padding: "8px",
                    textAlign: "left",
                  }}
                >
                  Sizes
                </th>
              </tr>
            </thead>
            <tbody>
              {p.colours && p.colours.length > 0 ? (
                p.colours.map((c) => (
                  <tr key={c.colorId}>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        color: "#333",
                      }}
                    >
                      {c.colorName}
                    </td>
                    <td
                      style={{
                        border: "1px solid #ccc",
                        padding: "8px",
                        color: "#555",
                      }}
                    >
                      {c.sizes && c.sizes.length > 0
                        ? c.sizes.map((s) => s.sizeName).join(", ")
                        : "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="2"
                    style={{
                      border: "1px solid #ccc",
                      padding: "8px",
                      textAlign: "center",
                      color: "#777",
                    }}
                  >
                    No colours / sizes available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      ))}
    </div>
  );
};

export default ViewProduct;
