const Users = require("../Models/signupModel");
const Profile = require("../Models/profileModel");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const nodemailer = require("nodemailer");

let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "dhanush.productone@gmail.com",
    pass: "xnpiythticlyvzgq",
  },
});
const { ObjectId } = mongoose.Types;

function createEmptyEducation() {
  return {
    levelofedu: " ",
    field: " ",
    school: " ",
    city: " ",
    country: " ",
    fromMonth: " ",
    fromYear: " ",
  };
}

function createEmptyProject() {
  return {
    Title: " ",
    company: " ",
    fromMonth: " ",
    fromYear: " ",
    description: " ",
    toMonth: " ",
    toYear: " ",
    skills: [],
  };
}

function createEmptyJob() {
  return {
    jobTitle: " ",
    company: " ",
    country: " ",
    city: " ",
    fromMonth: " ",
    fromYear: " ",
    description: " ",
    toMonth: " ",
    toYear: " ",
  };
}

function createEmptySurvey() {
  return {
    "What is your gender identity?": "male",
    "What is your race? (Select all that apply)": {
      Asian: true,
      "Native Hawaiian or Pacific Islander": false,
      "Black or African American": false,
      White: false,
      "Hispanic or Latinx": false,
      "Not listed": false,
      "Native American or Alaskan Native": false,
    },
    "What is your sexual orientation?": " ",
    "What is your age range?": " ",
    "What is your military status?": " ",
  };
}

function createSocialAccounts() {
  return {
    LinkedIn: "",
    GitHub: "",
    WebSite: "",
    HackerRank: "",
    CodeChef: "",
  };
}

function createEmptyProfile(userId) {
  return {
    UserId: userId,
    FullName: {
      FirstName: " ",
      LastName: " ",
      DisplayFirstName: " ",
      DisplayLastName: " ",
    },
    Location: {
      Country: " ",
      StreetAddress: " ",
      City: " ",
      PinCode: " ",
    },
    education: [],
    jobs: [],
    projects: [],
    skills: [" "],
    currentRole: " ",
    socialaccounts: createSocialAccounts(),
    WorkLocation: [" "],
    Survey: createEmptySurvey(),
    componentOrder: [
      "Recognitions",
      "ProjectsComponent",
      "SkillsComponent",
      "ExperienceComponent",
      "EducationComponent",
    ],
  };
}

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const existingUser = await Users.findOne({ email: email });

    if (!existingUser) {
      return res.status(401).json({ error: "Enter correct email/password" });
    }

    // Compare the hashed password
    const isPasswordMatch = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordMatch) {
      return res.status(401).json({ error: "Enter correct email/password" });
    }
    //console.log('Before')
    let jwttoken = jwt.sign(
      existingUser.toObject(),
      process.env.USER_SECRET_KEY,
      { expiresIn: "2h" }
    );
    //console.log(jwttoken);
    res.status(200).json({
      message: "User logged in successfully",
      token: jwttoken,
      type: "user",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changepassword = async (req, res) => {
  try {
    const { email, newpassword } = req.body;
    console.log(email);
    console.log(newpassword);
    const existingUser = await Users.findOne({ email: email });

    const hashedPassword = await bcrypt.hash(newpassword, 10);

    if (!existingUser) {
      return res.status(401).json({ error: "Enter correct email/password" });
    }

    existingUser.password =  hashedPassword;
    await existingUser.save();

    //console.log('Before')
    // let jwttoken = jwt.sign(existingUser.toObject(), process.env.USER_SECRET_KEY, { expiresIn: "2h" });
    //console.log(jwttoken);
    res.status(200).json({
      message: "Password Changed Successfully"
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    // const {otp} = req.body.otp;
    const existingUser = await Users.findOne({ email: email });

    if (existingUser) {
      return res
        .status(401)
        .json({ error: "User with the same email already exists." });
    }

    const otpSent = await sendOTPVerificationEmail(email);
    console.log(otpSent);

    return res
      .status(200)
      .json({ message: "Successfully Sent Mail", otp: otpSent });

    // // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // const newUser = new Users({
    //   'name': name,
    //   'email': email,
    //   'password': hashedPassword,
    //   'verified': false
    // });

    // await newUser.save().then(async (result) => {
    //   sendOTPVerificationEmail(result, res);
    // //   let jwttoken = jwt.sign({ email: email }, "abcdefg", { expiresIn: 2000 });
    // // res.status(200).json({ message: "User account signed up successfully", user: newUser, token: jwttoken, type: "user" });
    // });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: err.message });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    // const {otp} = req.body.otp;
    const existingUser = await Users.findOne({ email: email });

    if (!existingUser) {
      return res
        .status(401)
        .json({ error: "User with the email does not exists." });
    }

    const captchaSent = await sendForgotPasswordCaptcha(email);
    console.log(captchaSent);

    return res
      .status(200)
      .json({ message: "Successfully Sent Mail", captcha: captchaSent });

    // // Hash the password
    // const hashedPassword = await bcrypt.hash(password, 10);

    // const newUser = new Users({
    //   'name': name,
    //   'email': email,
    //   'password': hashedPassword,
    //   'verified': false
    // });

    // await newUser.save().then(async (result) => {
    //   sendOTPVerificationEmail(result, res);
    // //   let jwttoken = jwt.sign({ email: email }, "abcdefg", { expiresIn: 2000 });
    // // res.status(200).json({ message: "User account signed up successfully", user: newUser, token: jwttoken, type: "user" });
    // });
  } catch (err) {
    console.error("Error during signup:", err);
    res.status(500).json({ error: err.message });
  }
};

const sendOTPVerificationEmail = async (email) => {
  // //console.log('Hello')
  try {
    const otp = `${Math.floor(100000 + Math.random() * 900000)}`;

    const mailoptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p> Enter <b> ${otp} </b> in the app to verify your email address and complete the signup</p> <p> This code <b> expires in 1 hour</b></p>`,
    };

    const salt = 10;
    const hashedotp = await bcrypt.hash(otp, salt);
    await transporter.sendMail(mailoptions);
    return otp;
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const sendForgotPasswordCaptcha = async (email) => {
  // //console.log('Hello')
  try {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
    let captcha = '';
    const length = 6;
  
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      captcha += characters.charAt(randomIndex);
    }

    // const captcha = randomString;
    const mailoptions = {
      from: process.env.AUTH_EMAIL,
      to: email,
      subject: "Verify your email",
      html: `<p> Enter <b> ${captcha} </b> in the app to verify your email address and reset your password</p> <p> This code <b> expires in 1 hour</b></p>`,
    };

    // const salt = 10;
    // const hashedcaptcha = await bcrypt.hash(captcha, salt);
    await transporter.sendMail(mailoptions);
    return captcha;
  } catch (err) {
    res.status(500).json({ error: err.message });
    throw(err);
  }
};

const verifyotp = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new Users({
      name: name,
      email: email,
      password: hashedPassword,
      phone: phone,
    });

    await newUser.save();

    // Create a new profile using the user's _id
    const newProfile = new Profile(createEmptyProfile(newUser._id));

    // Save the new profile
    await newProfile.save();

    let jwttoken = jwt.sign(newUser.toObject(), process.env.USER_SECRET_KEY, {
      expiresIn: "2h",
    });

    return res
      .status(200)
      .json({
        message: "Successfully verified",
        token: jwttoken,
        type: "user",
      });
  } catch (err) {
    console.error("Error during user registration:", err);
    res.status(500).json({ error: err.message });
  }
};

const editphone = async (req, res) => {
  try {
    const details = req.body;
    console.log(details);
    const token = req.params.token;
    const decoded = jwt.verify(token, process.env.USER_SECRET_KEY);
    // console.log("Decoded", decoded);
    var updatedUser;
    updatedUser = await Users.updateOne({ _id: decoded._id }, details);

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

const resendotp = async (req, res) => {
  try {
    let { userId, email } = req.body;
    if (!userId || !email) {
      throw Error("Empty otp details are not allowed");
    } else {
      sendOTPVerificationEmail({ _id: userId, email }, res);
    }
  } catch (err) {
    res.status(500).json({
      status: "failed",
      message: err.message,
    });
  }
};
module.exports = {
  login,
  signup,
  verifyotp,
  resendotp,
  forgotpassword,changepassword,
  editphone,
};
