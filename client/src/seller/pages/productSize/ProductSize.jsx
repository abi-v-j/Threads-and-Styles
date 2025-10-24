import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ProductSize = () => {
  const { id } = useParams();
  const productId = id;

  /* ---------- dropdown lists ---------- */
  const [colors, setColors]   = useState([]);
  const [sizes, setSizes]     = useState([]);

  /* ---------- chosen values ---------- */
  const [colorId, setColorId] = useState('');
  const [sizeId, setSizeId]   = useState('');

  /* ---------- on mount ---------- */
  useEffect(() => {
    if (!productId) return alert('No product chosen');

    /* 1.  colours that exist in ProductColor for this product */
    axios.get(`http://localhost:5000/colorsByProduct/${productId}`)
         .then(res => setColors(res.data.data));

    /* 2.  all sizes (you can filter later if needed) */
    axios.get('http://localhost:5000/size')
         .then(res => setSizes(res.data.data));
  }, [productId]);

  /* ---------- submit ---------- */
  const handleSave = () => {
    if (!colorId || !sizeId) return alert('Pick both fields');
    axios.post('http://localhost:5000/productSize', { productId, colorId, sizeId })
         .then(() => {
           alert('Product-size saved');
           setColorId(''); setSizeId('');
         })
         .catch(err => alert(err.response?.data?.message || 'Error'));
  };

  /* ---------- UI ---------- */
  return (
    <div style={{ padding: 20 }}>
      <h3>Manage Product Size</h3>
      <table border="1" cellPadding="8">
        <tbody>
          <tr>
            <td>Product ID</td>
            <td>{productId}</td>
          </tr>
          <tr>
            <td>Colour</td>
            <td>
              <select value={colorId} onChange={e => setColorId(e.target.value)}>
                <option value="">-- select --</option>
                {colors.map(c => (
                  <option key={c.colorId} value={c.colorId}>{c.colorName}</option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td>Size</td>
            <td>
              <select value={sizeId} onChange={e => setSizeId(e.target.value)}>
                <option value="">-- select --</option>
                {sizes.map(s => (
                  <option key={s.sizeId} value={s.sizeId}>{s.sizeName}</option>
                ))}
              </select>
            </td>
          </tr>
          <tr>
            <td colSpan="2" align="center">
              <button onClick={handleSave}>Save Size</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default ProductSize;