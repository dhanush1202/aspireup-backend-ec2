const express = require('express')
const {editprofile, getProfile, addEduExp, deleteprofile, editprojeduexp} = require('../Controllers/profileController')
const router = express.Router()

router.post('/editprofile/:token', editprofile)

router.get('/getprofile/:token', getProfile)

router.post("/addeduexp/:token", addEduExp)

router.post("/deleteprofile/:token",deleteprofile)
router.post("/editprojeduexp/:token",editprojeduexp)


module.exports = router