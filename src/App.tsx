import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Product } from './pages/Product';
import { OrderSheet } from './pages/OrderSheet';
import { Success } from './pages/Success';
import { SuccessResult } from './pages/SuccessResult';
import './App.css';
import { Fail } from './pages/Fail';
import { OrderDetail } from './pages/OrderDetail';
import { Cancel } from './pages/Cancel';
import { OrderList } from './pages/OrderList';

function App(): React.ReactElement {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Product />} />
        <Route path="/order/list" element={<OrderList />} />
        <Route path=":orderId/order" element={<OrderSheet />} />
        <Route path=":orderId/result" element={<Success />} />
        <Route path=":orderId/result/success" element={<SuccessResult />} />
        <Route path=":orderId/result/fail" element={<Fail />} />
        <Route path=":orderId/detail" element={<OrderDetail />} />
        <Route path=":orderId/cancel" element={<Cancel />} />
        <Route path=":orderId/:orderProductOptionId/cancel" element={<Cancel />} />
      </Routes>
    </div>
  );
}

export default App;
