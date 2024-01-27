const Role = require('../models/role.js');
const User = require('../models/users.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { CreateSuccess } = require('../response/success.js');
const { CreateError } = require("../response/error.js");
const nodemailer=require('nodemailer')
const UserToken =require('../models/UserToken.js')
const verifyToken=require('../response/verifyToken.js')
module.exports.register = async (req, res, next) => {
    try {
        // Validate the gender field
        if (!['male', 'female'].includes(req.body.gender)) {
            return res.status(400).json({ error: 'Invalid gender value.' });
        }

        // Check if the email is already registered
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.status(400).json({ error: 'Email is already registered.' });
        }

        // Find the role with the name 'User'
        const role = await Role.findOne({ role: 'User' });
        if (!role) {
            return res.status(500).json({ error: 'User role not found.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new User instance with the provided data
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            password: hashPassword,
            role: role._id,
        
        });

        // Save the newUser instance to the database
        await newUser.save();

        // Return a successful response
        return next(CreateSuccess(200, "User Signup Successfully"));
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.login = async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("role");
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Password is incorrect' });
        }

        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
            roles: user.role ? [user.role.role] : [] // Check if user has a role and extract the role name
        },
        process.env.JWT_SECRET
        );
        
        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({
                status: 200,
                message: "Login Success",
                data: user,
                token:token
            });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};
///Register admin
module.exports.registerAdmin = async (req, res, next) => {
    try {
        // Validate the gender field
        if (!['male', 'female'].includes(req.body.gender)) {
            return res.status(400).json({ error: 'Invalid gender value.' });
        }

        // Find the role with the name 'User'
        const role = await Role.findOne({});
        if (!role) {
            return res.status(500).json({ error: 'User role not found.' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        // Create a new User instance with the provided data
        const newUser = new User({
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            email: req.body.email,
            phone: req.body.phone,
            gender: req.body.gender,
            password: hashPassword,
            isAdmin:true,
            role: role._id 
        });

        // Save the newUser instance to the database
        await newUser.save();

        // Return a successful response
        return next(CreateSuccess(200, "User Signup Successfully"));
    } catch (error) {
        console.error('Error registering user:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports.getProfile = async (req, res, next) => {
    try {
      // Assuming your decoded information has a user ID
      const userId = req.decoded.id;
  
      // Fetch user data from the database based on the user ID
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }
  
      // Send the user data in the response
      res.status(200).json({ success: true, user });
    } catch (error) {
      console.error('Error fetching user profile:', error);
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  };
  // Method to update user profile
module.exports.updateProfile = async (req, res) => {
    try {
        const userId = req.decoded.id; 
        const updates = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            phone: req.body.phone,
            gender: req.body.gender,
            avatarUrl: req.body.avatarUrl,
            dateOfBirth: req.body.dateOfBirth
        };

        const updatedUser = await User.findByIdAndUpdate(userId, updates, { new: true });
        res.status(200).json({ message: "Profile updated successfully", data: updatedUser });
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

module.exports.sendEmail = async (req, res, next) => {
    try {
        const { email } = req.body;

        if (!email) {
            return next(CreateError(400, 'Email address is required for password reset'));
        }

        const user = await User.findOne({ email: { $regex: '^' + email + '$', $options: 'i' } });

        if (!user) {
            return next(CreateError(404, 'User not found to reset the email'));
        }

        const payload = { email: user.email };
        const expiryTime = 300; // 5 minutes
        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: expiryTime });

        const newToken = new UserToken({
            userId: user._id,
            token,
        });

        const mailTransporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'nomadek21406c@gmail.com',
                pass: 'fmbr gfvk grpi hbmy',
            },
        });

        const mailDetails = {
            from: 'nomadek21406c@gmail.com',
            to: email,
            subject: 'Reset Password!',
            html: `
                <html>
                    <head>
                        <title>Password Reset Request</title>
                    </head>
                    <body>
                        <h1>Password Reset Request</h1>
                        <p>Dear, ${user.firstname}</p>
                        <p>You have requested to reset your password. Click the link below to reset it:</p>
                        <a href=${process.env.LIVE_URL}/reset/${token}>Reset Password</a>
                        <p>If you did not request a password reset, you can ignore this email.</p>
                        <p>Best regards,<br>Nomade</p>
                    </body>
                </html>
            `,
        };

        mailTransporter.sendMail(mailDetails, async (err, data) => {
            if (err) {
                console.log(err);
                return next(CreateError(500, 'Something went wrong while sending email'));
            } else {
                await newToken.save();
                return next(CreateSuccess(200, 'Email Send Successfully'));
            }
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return next(CreateError(500, 'Internal Server Error'));
    }
}
module.exports.resetPassword = async (req, res, next) => {
    const token = req.body.token;
    const newPassword = req.body.password;
  
    jwt.verify(token, process.env.JWT_SECRET, async (err, data) => {
      if (err) {
        return next(CreateError(500, 'Reset link is Expired'));
      } else {
        const response = data;
        const user = await User.findOne({ email: { $regex: '^' + response.email + '$', $options: 'i' } });
  
        if (!user) {
          return next(CreateError(404, 'User not found'));
        }
  
        const salt = await bcrypt.genSalt(10);
        const encryptedPassword = await bcrypt.hash(newPassword, salt);
        user.password = encryptedPassword;
  
        try {
          const updatedUser = await User.findOneAndUpdate(
            { _id: user._id },
            { $set: user },
            { new: true }
          );
  
          return res.status(200).json({ message: 'Password Reset Successfully' });
        } catch (error) {
          console.error('Error updating user:', error);
          return res.status(500).json({ message: 'Something went wrong' });
        }
      }
    });
  };
