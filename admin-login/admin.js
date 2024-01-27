const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');
const User = require('./user');
const router = express.Router();
const Role = require('./Role');

// Middleware to authenticate token
function authenticateToken(req, res, next) {
    const token = req.cookies.access_token;

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            console.error(err);
            return res.status(403).json({ message: 'Forbidden' });
        }
        req.user = user;
        next();
    });
}

router.use(express.json());
router.use(cookieParser());

// Create a default admin user
async function createDefaultAdminUser() {
    try {
        const existingUser = await User.findOne({ email: 'admin@gmail.com' });
        if (!existingUser) {
            const hashedPassword = await bcrypt.hash('123456', 10); // Hash the default password
            const adminRole = await Role.findOne(); // Assuming you have a role named 'admin'
            const newUser = new User({
                firstname:'admin',
                lastname:'admin',
                email: 'admin@gmail.com',
                phone:'1234567891',
                gender:'female',
                password: hashedPassword,
                isAdmin:true,
                role: adminRole._id 
            });
    

            await newUser.save();
            console.log('Default admin user created.');
        } else {
            console.log('Default admin user already exists.');
        }
    } catch (error) {
        console.error('Error creating default admin user:', error);
    }
}

// Call the function to create the default admin user when the server starts
createDefaultAdminUser();

router.post('/login-admin', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email }).populate("role").maxTimeMS(50000);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const isPasswordCorrect = await bcrypt.compare(req.body.password, user.password);

        if (!isPasswordCorrect) {
            return res.status(400).json({ error: 'Password is incorrect' });
        }

        // Kiểm tra isAdmin
        if (!user.isAdmin) {
            return res.status(403).json({ error: 'You are not an admin' });
        }

        const token = jwt.sign({
            id: user._id,
            isAdmin: user.isAdmin,
            roles: user.role ? [user.role.role] : []
        }, process.env.JWT_SECRET);

        res.cookie("access_token", token, { httpOnly: true })
            .status(200)
            .json({
                status: 200,
                message: "Login Success",
                data: user
            });
    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

module.exports = router;
