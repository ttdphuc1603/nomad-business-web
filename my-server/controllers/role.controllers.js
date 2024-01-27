const Role = require('../models/role.js');
const { CreateError } = require('../response/error.js');
const { CreateSuccess } = require('../response/success.js');
const sendResponse = (res, status, data) => {
    res.status(status).json(data);``
};

module.exports.createRole = async (req, res, next) => {
    try {
        if (!req.body.role || req.body.role === '') {
            return next(CreateError(400,'Role name is required.'))
            
        }

        const existingRole = await Role.findOne({ role: req.body.role });
        if (existingRole) {
           return next(CreateError(400,'Role already exists.'))
        }

        const newRole = new Role({ role: req.body.role });
        await newRole.save();

        return next(CreateSuccess(200,"Role Created!"))
    } catch (error) {
        console.error('Error creating role:', error);
        return next(CreateError(500,'Internal Server Error '))

    }
};

module.exports.updateRole = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
        if (role) {
            const newData = await Role.findByIdAndUpdate(
                req.params.id,
                { $set: req.body },
                { new: true }
            );
            return res.status(200).json({ message: 'Role Updated!', role: newData });
        } else {
            return next(CreateError(404,'Role not found'))
            'Role not found'
        }
    } catch (error) {
        console.error('Error updating role:', error);
        return next(CreateError(500,'Internal Server Error '))
    }
};

module.exports.getallRole = async (req, res) => {
    try {
        const role = await Role.find({});
        return res.status(200).send(role);
    } catch (error) {
        return res.status(500).send('Internal Server Error');
    }
};

module.exports.deleteRole = async (req, res) => {
    try {
        const roleId = req.params.id;
        const role = await Role.findById({ _id: roleId });
        if (role) {
            await Role.findByIdAndDelete(roleId);
            return res.status(204).send(); 
        } else {
            return res.status(404).send('Role not found');
        }
    } catch (error) {
        console.error('Error deleting role:', error);
        return res.status(500).send('Internal Server Error');
    }
};
