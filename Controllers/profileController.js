const Profile = require("../Models/profileModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const { ObjectId } = require("mongodb");

const editprofile = async (req, res) => {
  try {
    const details = req.body;
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
    //console.log("Decoded", decoded);
    const key = Object.keys(details)[0];
    //console.log(key);
    var updatedUser;
    updatedUser = await Profile.updateOne({ UserId: decoded._id }, details);

    if (updatedUser.nModified === 0) {
      return res.status(404).json({ message: "User not found", id: id });
    }

    return res
      .status(200)
      .json({ message: "Success", updated: updatedUser, details: details });
  } catch (err) {
    console.error("Error in editprofile:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err });
  }
};

const getProfile = async (req, res) => {
  try {
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
    const id = decoded._id;
    const existing_profile = await Profile.findOne({ UserId: id });

    if (!existing_profile) {
      return res.status(404).json({ message: "user not found", id: id });
    }

    return res.status(200).json({
      message: "successfully retrieved",
      existing_profile: existing_profile,
      id: id,
    });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: err.message });
    } else {
    }
    return res
      .status(500)
      .json({ message: "internal server error", error: err });
  }
};

const addEduExp = async (req, res) => {
  const details = req.body;
  const token = req.params.token;
  const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);

  const key = Object.keys(details)[0];

  try {
    const updatedUser = await Profile.updateOne(
      { UserId: decoded._id },
      { $push: { [key]: details[key] } }
    );

    if (updatedUser.nModified === 0) {
      return res.status(404).json({ message: "User not found", id: id });
    }

    return res
      .status(200)
      .json({ message: "Success", updated: updatedUser, details: details });
  } catch (error) {
    console.error("Error updating user:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteprofile = async (req, res) => {
  try {
    const details = req.body;
    const token = req.params.token;

    const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);

    const existing_profile = await Profile.findOne({ UserId: decoded._id });

    const key = Object.keys(details)[0];

    // Convert the string to an ObjectId
    const projectId = new ObjectId(details[key]._id);

    // console.log(existing_profile[key])
    // console.log(details[key])

    console.log(projectId);

    let newArray = existing_profile[key].filter(
      (obj) => obj._id.toString() != projectId.toString()
    );

    existing_profile[key] = newArray;
    // Save the updated profile to the database
    await existing_profile.save();
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Error deleting project" });
  }
};

const editprojeduexp = async (req, res) => {
  try {
      const details = req.body;
      // console.log(details)
      const token = req.params.token;

    const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);

    const existing_profile = await Profile.findOne({ UserId: decoded._id });
    const key = Object.keys(details)[0];
    console.log(key);
    // const projectId = new ObjectId(details[key]._id);
    // console.log(existing_profile);\
    const arrayName = existing_profile[`${key}`]
    const elementId = details.id
    const indexToUpdate = arrayName.findIndex(obj => obj._id.toString() === elementId);
    console.log(indexToUpdate)
    if (indexToUpdate !== -1) {
      // Update the properties of the array element
      Object.assign(arrayName[indexToUpdate], details[key]);

      // Save the updated profile to the database
      await existing_profile.save();

      res.status(200).json({ success: true, message: 'Element edited successfully'});
    
  }
  else{
    res.status(404).json({success: false, message:" element not found"});
  }
}
   catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Error editing element', error: error });
  }
};



module.exports = {
  editprofile,
  getProfile,
  addEduExp,
  deleteprofile,
  editprojeduexp,
};
