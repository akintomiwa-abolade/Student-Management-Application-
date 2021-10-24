/**
|----------------------------------
| User Api Route
|----------------------------------
*/

const express = require("express");
const router = express.Router();
const UserController = require('../../controller/UserController');
const {parser} = require('../../middlewares/cloudinary');
const authGuard = require('../../middlewares/authguard');


// Get user profile
router.get('/user/profile', authGuard, UserController.getUserProfile);

// user updates profile
router.put('/user/update/profile', authGuard, UserController.updateBasicProfile);

// user update token
router.put('/user/update/device/token', authGuard, UserController.updateDeviceToken);

// user change password
router.put('/user/change/password', authGuard, UserController.changePassword);

// upload profile picture
router.put("/user/profile/picture/update",  authGuard, parser.single('file'), UserController.updateProfileImage);

// user schedule counselling
router.post('/user/create/counselling', authGuard, UserController.scheduleCounselling);

// user view counselling requests
router.get('/user/view/counsellings', authGuard, UserController.fetchCounsellingRequests);

// user view Ministers
router.get('/user/view/ministers', authGuard, UserController.fetchAllMinisters);

// user view council
router.get('/user/view/council', authGuard, UserController.fetchAllCouncils);

// user view Members
router.get('/user/view/members', authGuard, UserController.fetchAllMembers);

// user view monthly vips
router.get('/user/view/vips', authGuard, UserController.fetchAllVIPDates);

// user create pledge
router.post('/user/create/pledge', authGuard, UserController.initiatePledge);

// user view all pledge
router.get('/user/view/pledges', authGuard, UserController.fetchAllPledges);

// user update pledge status
router.put('/user/update/pledges', authGuard, UserController.updatePledge);

module.exports = router;