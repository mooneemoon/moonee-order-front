import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Pay } from './pages/Pay';
import { Success } from './pages/Success';
import { Fail } from './pages/Fail';
import './App.css';
import { SuccessResult } from './pages/SuccessResult';

function App(): React.ReactElement {
  return (
    <div className="App">
      <Routes>
        <Route index element={<Pay />} />
        <Route path=":orderId/:requestId/success" element={<Success />} />
        <Route path=":orderId/:requestId/success/result" element={<SuccessResult />} />
        <Route path=":orderId/:requestId/fail" element={<Fail />} />
      </Routes>
    </div>
  );
}

export default App;
