const express = require('express')

const {login,signup, verifyotp, resendotp,forgotpassword,changepassword,editphone} = require('../Controllers/loginController')
const router = express.Router()

router.post('/userssignup',signup)
router.post('/userslogin',login)
router.post('/verifyOTP', verifyotp)
router.post("/resendotp", resendotp)

router.post("/forgotpassword",forgotpassword)
router.post("/changepassword",changepassword)

router.put("/editphone/:token", editphone)



module.exports = router