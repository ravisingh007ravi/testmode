const express = require("express");
const multer = require('multer');
const { CreateUser, getUserById, UserOtpVerify, LogInUser, resendOtp, userDelete, userupdated,
    changePassword, uploadProfileImg, newEmail, newEmailVerify } = require('../controller/userController');
const { LogInAdmin, GetAllUserData, adminOtpVerification } = require('../controller/AdminController')
const { createProduct, getAllProduct } = require('../controller/productController')
const { userAuthenticate, userAuthorize } = require('../middleware/userAuth')
const { authenticate, authorize } = require('../middleware/adminAuth')
const router = express.Router();

const upload = multer({ storage: multer.diskStorage({}) });

// POST route to create a user   
router.post('/CreateUser', CreateUser);
router.get('/getUserById/:id', getUserById);
router.post('/user_otp_verify/:id', UserOtpVerify);
router.post('/LogInUser', LogInUser);
router.get('/resendOtp/:id', resendOtp);
router.delete('/userDelete/:id', userAuthenticate, userAuthorize, userDelete);
router.put('/userupdated/:id', userAuthenticate, userAuthorize, userupdated);
router.put('/changePassword/:id', userAuthenticate, userAuthorize, changePassword);
router.put('/uploadProfileImg/:id', upload.single("profileImg"), userAuthenticate, userAuthorize, uploadProfileImg);
router.put('/newEmail/:id', userAuthenticate, userAuthorize, newEmail);
router.post('/newEmailVerify/:id', userAuthenticate, userAuthorize, newEmailVerify);

// POST route to create a Admin
router.post('/LogInAdmin', LogInAdmin);
router.post('/adminOtpVerification/:id', authenticate, authorize, adminOtpVerification);
router.get('/GetAllUserData/:type/:isDeleted', authenticate, GetAllUserData);

// POST route to create a Product
router.post('/create_product/:id', upload.single("productImg"), authenticate, authorize, createProduct)
router.get('/get_all_product/:type',  getAllProduct)

router.use((_, res) => { res.status(404).send({ status: false, msg: 'Invalid URL' }) });

module.exports = router; 
