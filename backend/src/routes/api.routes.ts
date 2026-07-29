import { Router } from 'express';
import multer from 'multer';
import {
  login,
  registerUser,
  registerSeller,
  getHome,
  logout,
  deleteUser,
} from '../controllers/auth.controller.js';
import {
  exploreProducts,
  viewSingleProduct,
  getAllSellers,
  getSellerDetails,
  forgotPassword,
  verifyOtpForgotPassword,
  saveFcmToken,
  clearCache,
} from '../controllers/user.controller.js';
import {
  addToCart,
  getCart,
  removeFromCart,
} from '../controllers/cart.controller.js';
import {
  placeOrder,
  cancelOrder,
  viewUserOrders,
  resendOtp,
  submitFeedback,
} from '../controllers/order.controller.js';
import {
  viewProfile,
  updateProfile,
  addAddress,
  uploadProfilePicture,
} from '../controllers/profile.controller.js';
import {
  addProduct,
  getSellerProducts,
  deleteProduct,
  updateProduct,
  acceptOrder,
  rejectOrder,
  viewSellerOrders,
  verifyOtp,
  updateSellerProfile,
  getSellerProfile,
} from '../controllers/seller.controller.js';
import {
  viewPending,
  acceptItem,
  rejectItem,
  viewAllProducts,
  viewAllSellers,
  deleteProducts,
  deleteSeller,
  viewSellerAdminDetails,
  viewOrdersSummary,
  viewOrdersBySeller,
  approveSeller,
  viewPendingSellers,
} from '../controllers/admin.controller.js';

import { jwtAuthMiddleware, requireRole } from '../middlewares/auth.middleware.js';

const upload = multer({ storage: multer.memoryStorage() });
const router = Router();

// --- PUBLIC ROUTES ---
router.post('/logins', login);
router.post('/register', registerUser);
router.post('/register-seller', registerSeller);
router.get('/explore', exploreProducts);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp-forgetPassword', verifyOtpForgotPassword);
router.get('/home', getHome);
router.post('/logout', logout);

// --- AUTHENTICATED USER ROUTES ---
router.get('/products/:id', jwtAuthMiddleware, viewSingleProduct);
router.get('/get-allSellers', getAllSellers); // Accessible freely or authenticated
router.get('/get-seller/:id', jwtAuthMiddleware, getSellerDetails);
router.post('/save-fcm-token', jwtAuthMiddleware, saveFcmToken);
router.get('/clear-cache', jwtAuthMiddleware, clearCache);
router.delete('/delete-user/:id', jwtAuthMiddleware, deleteUser);

// Cart
router.post('/add-to-cart', jwtAuthMiddleware, requireRole(['ROLE_USER']), addToCart);
router.get('/get-cart', jwtAuthMiddleware, requireRole(['ROLE_USER']), getCart);
router.delete('/remove-from-cart/:id', jwtAuthMiddleware, requireRole(['ROLE_USER']), removeFromCart);

// Orders
router.post('/place-order', jwtAuthMiddleware, requireRole(['ROLE_USER']), placeOrder);
router.post('/cancel-order/:id', jwtAuthMiddleware, requireRole(['ROLE_USER']), cancelOrder);
router.get('/view-order-user', jwtAuthMiddleware, requireRole(['ROLE_USER']), viewUserOrders);
router.get('/orders/:orderId/resend-otp', jwtAuthMiddleware, requireRole(['ROLE_USER']), resendOtp);
router.post('/feedback', jwtAuthMiddleware, requireRole(['ROLE_USER']), submitFeedback);

// Profile
router.get('/view-profile', jwtAuthMiddleware, viewProfile);
router.patch('/update-profile', jwtAuthMiddleware, updateProfile);
router.patch('/add-address', jwtAuthMiddleware, addAddress);
router.patch('/image-upload', jwtAuthMiddleware, upload.single('file'), uploadProfilePicture);

// --- SELLER ROUTES (/seller/*) ---
router.post(
  '/seller/add-product',
  jwtAuthMiddleware,
  requireRole(['ROLE_SELLER']),
  upload.single('image'),
  addProduct
);
router.get('/seller/get-All-products', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), getSellerProducts);
router.delete('/seller/delete-product', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), deleteProduct);
router.patch('/seller/update-product', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), updateProduct);
router.post('/seller/accept-order', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), acceptOrder);
router.post('/seller/reject-order', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), rejectOrder);
router.get('/seller/view-order-seller', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), viewSellerOrders);
router.post('/seller/verify-otp', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), verifyOtp);
router.post('/seller/update-profile', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), updateSellerProfile);
router.get('/seller/get-seller-profile', jwtAuthMiddleware, requireRole(['ROLE_SELLER']), getSellerProfile);

// --- ADMIN ROUTES (/admin/*) ---
router.get('/admin/view-pending', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), viewPending);
router.post('/admin/accept-item', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), acceptItem);
router.post('/admin/reject-item', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), rejectItem);
router.get('/admin/products-viewAll', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), viewAllProducts);
router.get('/admin/Sellers-viewAll', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), viewAllSellers);
router.delete('/admin/delete-product', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), deleteProducts);
router.delete('/admin/delete-seller/:id', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), deleteSeller);
router.get('/admin/view-seller/:id', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), viewSellerAdminDetails);
router.get('/admin/view-orders', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), viewOrdersSummary);
router.get('/admin/view-orders/seller/:id', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), viewOrdersBySeller);
router.post('/admin/approve-seller', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), approveSeller);
router.get('/admin/pending-seller', jwtAuthMiddleware, requireRole(['ROLE_ADMIN']), viewPendingSellers);

export default router;
