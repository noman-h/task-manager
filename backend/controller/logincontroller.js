const user = require("../model/userModel");
const devices = require("../model/loginModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const moment = require("moment");
const os = require("os");

exports.singup = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!(name && email && phone && password)) {
      return res.status(400).json({ message: "all keys are required" });
    }

    const existinguser = await user.findOne({ email });
    if (existinguser) {
      return res.status(409).json({ message: "user already exist" });
    }

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const data = { name, email, phone, password: hash, role };
    const result = await user.create(data);

    return res.status(201).json({ message: "singup successfully" });
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!(email && password)) {
      return res.status(400).json({ message: "all keys are required" });
    }

    const result = await user.findOne({ email });
    if (!result) {
      return res.status(404).json({ message: "user not found" });
    }

    const match = bcrypt.compareSync(password, result.password);

    if (!match) {
      return res.status(400).json({ message: "login failed" });
    }
    const device = {
      user: result._id,
      hostname: os.hostname(),
      platform: os.platform(),
      arch: os.arch(),
      ostype: os.type(),
    };
    const resu = await devices.create(device);
    console.log(resu);

    const token = jwt.sign({ email }, process.env.secretkey, {
      expiresIn: "1d",
    });
    return res
      .status(200)
      .json({ message: "login successfully", token, result });
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};

exports.googlelogin = async (req, res) => {
  try {
    const { email } = req.body;
    const data = req.body;

    const result = await user.findOne({ email });
    if (!result) {
      const created = await user.create({ ...data });
      const device = {
        user: result._id,
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        ostype: os.type(),
      };
      const resu = await devices.create(device);
      const token = jwt.sign({ email }, process.env.secretkey, {
        expiresIn: "1d",
      });
      return res
        .status(200)
        .json({ message: "login successfully", token, result: created });
    } else {
      const device = {
        user: result._id,
        hostname: os.hostname(),
        platform: os.platform(),
        arch: os.arch(),
        ostype: os.type(),
      };
      const resu = await devices.create(device);
      const token = jwt.sign({ email }, process.env.secretkey, {
        expiresIn: "1d",
      });
      return res
        .status(200)
        .json({ message: "login successfully", token, result });
    }
  } catch (err) {
    res.status(500).json({ message: "internal server error", err });
  }
};

exports.getuser = async (req, res) => {
  try {
    const email = req.user.email;
    if (req.user.role === "admin") {
      const allresult = await user.find();
      return res.status(200).json(allresult);
    } else {
      const result = await user.find({ role: "user", email });
      if (!result) {
        return res.status(404).json({ message: "no user found" });
      }
      return res.status(200).json(result);
    }
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

exports.alluser = async (req, res) => {
  try {
    const result = await user.find({ role: "user" });
    if (!result) {
      return res.status(404).json({ message: "no user found" });
    }
    return res.status(200).json(result);
  } catch (err) {
    res.status(500).json({ message: "internal server error" });
  }
};

exports.resetpass = async (req, res) => {
  try {
    const { email, password, confirmpassword } = req.body;

    const result = await user.findOne({ email });
    if (!result) {
      return res.status(404).json({ message: "email not found" });
    } else {
      const match = bcrypt.compareSync(password, result.password);
      if (match) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(confirmpassword, salt);

        const updated = await user.findOneAndUpdate(
          { email },
          { password: hash },
        );

        return res.status(200).json({ message: "reset successfully" });
      } else {
        return res.status(401).json({ message: "login failed" });
      }
    }
  } catch (err) {
    res.status(500).json(err);
  }
};

const otptemplate = (
  otp,
) => `<div style="font-family:Arial,sans-serif;padding:20px;border:1px solid #ddd;border-radius:8px;max-width:400px;margin:auto;">
  <h2>Email Verification</h2>
  <p>Your OTP is:</p>
  <h1 style="color:#0d6efd;">${otp}</h1>
  <p>This OTP is valid for 10 minutes.</p>
  <p>If you didn't request this, please ignore this email.</p>
</div>`;

const helper = require("../utils/helper");
const { log } = require("console");
exports.otpsend = async (req, res) => {
  try {
    const { email, expiretime } = req.body;
    const result = await user.findOne({ email });
    if (!result) {
      return res.status(404).json({ message: "email not found" });
    } else {
      const otp = helper.otpgen();
      const saveotp = await user.findOneAndUpdate(
        { email },
        { otp, expiretime },
      );
      if (helper.mailsender(email, "OTP Verification", otptemplate(otp))) {
        return res.status(200).json({ message: "otp send successfully" });
      } else {
        return res.status(400).json({ message: "failed to send otp" });
      }
    }
  } catch (err) {
    console.log(err);

    res.status(500).json(err);
  }
};

exports.otpcheck = async (req, res) => {
  try {
    const { otp, email } = req.body;
    const result = await user.findOne({ email });
    if (!result) {
      return res.status(404).json({ message: "email not found" });
    } else {
      if (result.otp === Number(otp) && moment().isBefore(result.expiretime)) {
        return res.status(200).json({ message: "Code verify" });
      } else if (result.otp !== Number(otp)) {
        return res.status(401).json({ message: "wrong code" });
      } else {
        await user.findOneAndUpdate({ email }, { otp: "", expiretime: "" });
        return res.status(403).json({ message: "Code expire" });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};

exports.forgetpass = async (req, res) => {
  try {
    const { otp, email, confirmpassword } = req.body;
    const result = await user.findOne({ email });
    if (!result) {
      return res.status(404).json({ message: "email not found" });
    } else {
      if (result.otp === Number(otp)) {
        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        const hash = bcrypt.hashSync(confirmpassword, salt);

        const updated = await user.findOneAndUpdate(
          { email },
          { password: hash, otp: "", expiretime: "" },
        );
        return res.status(200).json({ message: "changed successfully" });
      } else if (result.otp !== Number(otp)) {
        return res.status(401).json({ message: "wrong code" });
      }
    }
  } catch (err) {
    return res.status(500).json({ message: "internal server error" });
  }
};

exports.changetheme = async (req, res) => {
  try {
    const { theme } = req.body;
    const { email } = req.user;
    const result = await user.findOne({ email });
    if (!result) {
      return res.status(404).json({ message: "user not found" });
    } else {
      const updated = await user.findOneAndUpdate({ email }, { status: theme });

      return res.status(200).json({ message: "changed successfully", updated });
    }
  } catch (err) {
    res.status(500).json(err);
  }
};
