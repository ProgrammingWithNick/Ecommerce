import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, Routes } from 'react-router-dom';
import { checkAuth } from './store/authSlice';
import { Skeleton } from './components/ui/skeleton';
import AuthLayout from './components/auth/layout';
import LogIn from './pages/Auth/logIn';
import SignUp from './pages/Auth/signUp';
import AdminLayout from './components/admin/layout';
import AdminDashboard from './pages/admin/dashboard';
import AdminProducts from './pages/admin/products';
import AdminOrders from './pages/admin/order';
import AdminFeatures from './pages/admin/features';
import ShoppingLayout from './components/shopping/layout';
import NotFound from './pages/not-found';
import ShoppingHome from './pages/shopping/home';
import ShoppingListing from './pages/shopping/listing';
import ShoppingCheckout from './pages/shopping/checkout';
import ShoppingAccount from './pages/shopping/account';
import CheckAuth from './components/common/check-auth';
import UnauthPage from './pages/unauth-page';
import { AppDispatch, RootState } from './store/store';
import ForgotPassword from './pages/Auth/forgotPassword';
import ResetPassword from './pages/Auth/ResetPassword';
import PaypalReturnPage from './pages/shopping/paypal-return';
import PaymentSuccessPage from './pages/shopping/payment-success';
import SearchProducts from './pages/shopping/search';

function App() {
  const { loading, authChecked } = useSelector(
    (state: RootState) => state.auth
  );

  const dispatch = useDispatch<AppDispatch>();

  // Initial auth check when app loads
  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  // Show a loading state if we're still checking auth
  if (loading && !authChecked) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Skeleton className="w-64 h-64 bg-gray-200 rounded-md" />
      </div>
    );
  }

  return (
    <div className='flex flex-col overflow-hidden bg-white min-h-screen'>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          <Route path="login" element={<LogIn />} />
          <Route path="signup" element={<SignUp />} />
          <Route path="forgot-password" element={<ForgotPassword />} />
        </Route>

        {/* Reset Password Route (Public) */}
        <Route path="/reset-password/:token" element={<ResetPassword />} />
        
        {/* Unauthorized Page (Public) */}
        <Route path="/unauth-page" element={<UnauthPage />} />

        {/* Protected Admin Routes */}
        <Route path="/admin" element={
          <CheckAuth>
            <AdminLayout />
          </CheckAuth>
        }>
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>

        {/* Protected Shopping Routes */}
        <Route path="/shop" element={
          <CheckAuth>
            <ShoppingLayout />
          </CheckAuth>
        }>
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckout />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage/>} />
          <Route path="search" element={<SearchProducts/>} />
        </Route>

        {/* Home Route with Auth Check */}
        <Route path="/" element={<CheckAuth><div></div></CheckAuth>} />
        
        {/* 404 Page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;