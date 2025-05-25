import React, { useEffect, useState } from 'react';
import { useParams, Redirect } from 'react-router-dom';
import axios from 'axios';

export default function ProductRouter() {
  const { pid } = useParams();
  const [redirectPath, setRedirectPath] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8000/productslist/${pid}`)
      .then(res => {
        const product = res.data;
        if (product.condition === 'new') {
          setRedirectPath(`/ProductPage/${pid}`);
        } else if (product.condition === 'second') {
          setRedirectPath(`/SeProductPage/${pid}`);
        } else {
          setError('未知的商品類型');
        }
      })
      .catch(() => setError('查無此商品'));
  }, [pid]);

  if (error) return <p>{error}</p>;
  if (redirectPath) return <Redirect to={redirectPath} />;
  return <p>載入中...</p>;
}