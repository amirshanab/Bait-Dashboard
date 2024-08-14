// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from "./components/Layout/footerHader/Header";
import Footer from "./components/Layout/footerHader/Footer";
import Sidebar from "./components/Layout/sidebar/Sidebar";
import Dashboard from './screens/Homescreen/Dashboard';
import ManageProductsScreen from './screens/manageProductScreen/ManageProductsScreen';
import AddProductScreen from './screens/AddproductScreen/AddProductScreen';
import ManageOrdersScreen from './screens/Orders/ManageOrdersScreen';
import AnalyticsScreen from "./screens/AnalyticsScreen/AnalyticsScreen";
import ManageUsersScreen from "./screens/UserScreen/ManageUsersScreen";
import InventoryManagement from "./screens/InventoryScreen/InventoryManagement";
import ManageRegionsScreen from "./screens/ManageRecipesScreen/ManageRegionsScreen";


function App() {
  return (
      <Router>
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
          <Header />
          <div style={{ display: 'flex', flexGrow: 1, overflow: 'hidden' }}>
            <Sidebar />
            <main style={{ flexGrow: 1, padding: '20px', overflowY: 'auto' }}>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/manage-products" element={<ManageProductsScreen />} />
                <Route path="/manage-users" element={<ManageUsersScreen />} />
                <Route path="/add-product" element={<AddProductScreen />} />
                <Route path="/manage-orders" element={<ManageOrdersScreen />} />
                <Route path="/analytics" element={<AnalyticsScreen />} />
                <Route path="/inventory" element={<InventoryManagement />} />
                <Route path="/manage-regions" element={<ManageRegionsScreen />} />
              </Routes>
            </main>
          </div>
          <Footer />
        </div>
      </Router>
  );
}

export default App;
