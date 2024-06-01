// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Layout/footerHader/Header";
import Footer from "./components/Layout/footerHader/Footer";
import Sidebar from "./components/Layout/sidebar/Sidebar";
import Dashboard from './screens/Homescreen/Dashboard';
import ManageProductsScreen from './screens/manageProductScreen/ManageProductsScreen';
import AddProductScreen from './screens/AddProductScreen';
import AddRecipeScreen from "./screens/smartdishes/AddRecipeScreen";
import ManageOrdersScreen from './screens/Orders/ManageOrdersScreen';
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
                <Route path="/manage-products" element={<ManageProductsScreen />} />
                <Route path="/add-product" element={<AddProductScreen />} />
                <Route path="/add-recipe" element={<AddRecipeScreen />} />
                <Route path="/manage-orders" element={<ManageOrdersScreen />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
