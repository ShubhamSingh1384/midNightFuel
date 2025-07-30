import React from 'react'
import SellerDashboard from './components/SellerDashboard';

import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
  RouterProvider,
} from "react-router-dom";
import AddProduct from './components/AddProduct';
import Listitems from './components/Listitems';
import Orders from './components/Orders';
import Auth from './components/Auth';

import ProtectRoutes from './components/ProtectRoutes';
import PublicRoutes from './components/PublicRoutes';
import { ToastContainer } from 'react-toastify';
import ResetPassword from './components/ResetPassword';
import Contact from './components/Contact';
import NotFound from './components/NotFound';
import SuccessfullLogin from './components/SuccessfullLogin';
import SuccessPayment from './components/SuccessPayment';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      {/* Independent Auth Route */}
      <Route element={<PublicRoutes />}>
        <Route path="/auth" element={<Auth />} />
        <Route path="/" element={<Auth />} />
        <Route path='/seller/resetpassword' element={<ResetPassword />} />
      </Route>

      {/* Seller Dashboard and other nested routes */}
      <Route element={<ProtectRoutes />}>
        <Route path="/seller" element={<SellerDashboard />}>
          <Route path="addproduct" element={<AddProduct />} />
          <Route path="listitems" element={<Listitems />} />
          <Route path="orders" element={<Orders />} />
          <Route path='contact' element={<Contact />} />
          <Route path="success-login" element={<SuccessfullLogin />}/>
          <Route path="payment-success" element={<SuccessPayment />}/>
        </Route>
      </Route>

      <Route path='*' element={<NotFound />} />
    </>
  )
);


function App() {
  // console.log(Auth);
  return (
    <>
      <ToastContainer />
      <RouterProvider router={router} />
    </>
  );
}

export default App