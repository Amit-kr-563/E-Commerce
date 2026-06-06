import { useState } from 'react';
// export default App;
import { Route, Routes } from "react-router-dom";
import AboutPage from './Admin/AboutPage';
import AddProduct from './Admin/AddProduct';
import AdminLogin from './Admin/Adminlogin';
import AdminOrdersPage from './Admin/Adminpage';
import EditProduct from './Admin/EditProduct';
import Loginpage from "./Admin/Loginpage";
import RegisterChoice from './Admin/RegisterChoice';
import RegisterForm from "./Admin/RegisterForm";
import SellerDashboard from './Admin/SellerDashboard';
import Sellerlogin from './Admin/Sellerlogin';
import SellerOrders from './Admin/SellerOrders';
import SellerRegister from './Admin/SellerRegister';
import CartPage from './components/CartPage';
import ProceedToPayPage from "./components/checkout";
import Homepage from "./components/Homepage";
import Kidspage from "./components/Kidspage";
import Menpage from "./components/Menpage";
// import Paymentpage from './components/Paymentpage';
import Shop from "./components/Shop";
import UserOrders from './components/UserOrders';
import WatchlistPage from "./components/Watchlistpage";
import Womenpage from "./components/Womenpage";
import Companyinfo from './pages/Companyinfo';
import ContectSection from './pages/Contectsection';
import Productdetail from "./pages/Productdetail";

function App(props) {
 const [loggedInUser, setLoggedInUser] = useState(() => {
    const saved = localStorage.getItem('loggedInUser');
    return saved ? JSON.parse(saved).user : null;
  });
  return (
   
      <Routes>
        <Route path="/" exact element={<Homepage />} />
        <Route path="/login" exact element={<Loginpage  setLoggedInUser={setLoggedInUser}/>} />
        <Route path="/userinfo" element={<AboutPage user={loggedInUser} />} />
        <Route path="/aboutus" exact element={<Companyinfo/>} />
        
        {/* Registration Routes */}
        <Route path="/register" exact element={<RegisterChoice />} />
        <Route path="/register/user" exact element={<RegisterForm />} />
        <Route path="/register/seller" exact element={<SellerRegister />} />
        
        <Route path="/Shop" exact element={<Shop />} />
        <Route path="/Menpage" exact element={<Menpage />} />
        <Route path="/Womenpage" exact element={<Womenpage />} />
        <Route path="/Kidspage" exact element={<Kidspage />} />
        <Route path="/product/:id" element={<Productdetail />} />
        <Route path="/cart" exact element={<CartPage  user={loggedInUser}/>} />
        <Route path="/watchlist" element={<WatchlistPage user={loggedInUser} />} />
        <Route path="/my-orders" element={<UserOrders />} />
        <Route path="/checkout" element={<ProceedToPayPage/>}/>
        <Route path="/admin" exact  element={<AdminLogin/>}/>
        <Route path="admin/orders" element={<AdminOrdersPage/>}></Route>
        {/* <Route path="/payment" element={<Paymentpage />} /> */}
        <Route path="/contect" element={<ContectSection/>}></Route>
        
        {/* Seller Routes */}
        <Route path="/seller/login" element={<Sellerlogin />} />
        <Route path="/seller/dashboard" element={<SellerDashboard />} />
        <Route path="/seller/orders" element={<SellerOrders />} />
        <Route path="/seller/add-product" element={<AddProduct />} />
        <Route path="/seller/edit-product/:id" element={<EditProduct />} />
      </Routes>
    // </CartProvider>
  );
}





export default App;
