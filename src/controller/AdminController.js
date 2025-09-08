const userModel = require('../Model/userModel');
const { otpVerificationAdmin } = require('../Mail/UserMail')
const { errorHandlingdata } = require('../error/errorHandling')
const jwt = require('jsonwebtoken');
require('dotenv').config();

exports.LogInAdmin = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data;


        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        const existingAdmin = await userModel.findOne({ email: email, role: 'admin' });

        if (!existingAdmin) return res.status(400).send({ status: false, msg: "User Not Found" });

        await userModel.findOneAndUpdate({ email: email, role: 'admin' }, { $set: { 'Varification.Admin.adminOtp': randomOtp } });

        otpVerificationAdmin(existingAdmin.name, existingAdmin.email, randomOtp);

         const AdminDB ={
            userProfileImg: existingAdmin.profileImg,
            name: existingAdmin.name,
            email: existingAdmin.email,}

        const token = jwt.sign({ adminId: existingAdmin._id }, process.env.JWT_Admin_SECRET_KEY, { expiresIn: '1d' });
        return res.status(200).send({ status: true, msg: 'Pls Verify Your Otp', data: { token, id: existingAdmin._id ,AdminDB} });

    }
    catch (e) { errorHandlingdata(e, res) }
}

exports.adminOtpVerification = async (req, res) => {
    try {
        const otp = req.body.otp;
        const id = req.params.id;

        if (!otp) return res.status(400).send({ status: false, msg: "pls Provide OTP" });

        const admin = await userModel.findById(id);

        if (!admin) return res.status(400).send({ status: false, msg: "Admin Not Found" });

        if (admin.role == 'user') return res.status(400).send({ status: false, msg: "You are not Admin" });

        if (admin.Varification.Admin.adminOtp != otp) return res.status(400).send({ status: false, msg: "Wrong Otp" });

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { 'Varification.Admin.adminOtp': Math.floor(1000 + Math.random() * 9000) } }, { new: true });

        res.status(200).send({ status: true, msg: "Successfully Otp Verified" })

    }
    catch (e) { errorHandlingdata(e, res) }
}

exports.GetAllUserData = async (req, res) => {
    try {
        const type = req.params.type;
        const isDeleted = req.params.isDeleted;
        if (type == 'all') {
            if ((isDeleted == 'true')) {
                const DB = await userModel.find({ role: 'user', 'Varification.user.isDeleted': true });
                if (DB.length == 0) return res.status(400).send({ status: false, msg: 'Data Not Found' })
                if (!DB) return res.status(400).send({ status: false, msg: 'Data Not Found' })
                return res.status(200).send({ status: true, msg: 'Successfully Get All User Data', data: DB })
            }
            else {

                const DB = await userModel.find({ role: 'user', 'Varification.user.isDeleted': false });
                if (!DB) return res.status(400).send({ status: false, msg: 'Data Not Found' })
                return res.status(200).send({ status: true, msg: 'Successfully Get All User Data', data: DB })
            }
        }
        else {
            const DB = await userModel.findById(type);
            if (!DB) return res.status(400).send({ status: false, msg: 'Data Not Found' })
            return res.status(200).send({ status: true, msg: 'Successfully User Data', data: DB })
        }
    }
    catch (e) { errorHandlingdata(e, res) }
}