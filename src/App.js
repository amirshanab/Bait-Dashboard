import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Sidebar from "./components/Layout/sidebar/Sidebar";
import Dashboard from './screens/Dashboard';
import Users from './screens/Users';
import Orders from './screens/Orders';
import ManageProductsScreen from './screens/manageProductScreen/ManageProductsScreen';
import AddProductScreen from './screens/AddProductScreen';

function App() {
  return (
      <Router>
        <div style={{display: 'flex', flexDirection: 'column', height: '100vh'}}>
          <Header />
          <div style={{display: 'flex', flexGrow: 1, overflow: 'hidden'}}>
            <Sidebar />
            <main style={{flexGrow: 1, padding: '20px', overflowY: 'auto'}}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/manage-products" element={<ManageProductsScreen />} />
                <Route path="/add-product" element={<AddProductScreen />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
