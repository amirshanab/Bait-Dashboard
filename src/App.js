import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import Sidebar from "./components/Layout/Sidebar";
import Dashboard from './screens/Dashboard';
import Users from './screens/Users';
import Products from './screens/Products';
import Orders from './screens/Orders';
// Import the new screens
import ManageProductsScreen from './screens/ManageProductsScreen';
import AddProductScreen from './screens/AddProductScreen';

function App() {
  return (
      <Router>
        <div style={{display: 'flex'}}>
          <Sidebar />
          <div style={{flexGrow: 1}}>
            <Header />
            <main style={{padding: '20px'}}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/users" element={<Users />} />
                <Route path="/products" element={<Products />} />
                <Route path="/orders" element={<Orders />} />
                {/* Add routes for the new screens */}
                <Route path="/manage-products" element={<ManageProductsScreen />} />
                <Route path="/add-product" element={<AddProductScreen />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </div>
      </Router>
  );
}

export default App;
