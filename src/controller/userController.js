const userModel = require('../Model/userModel');
const { otpVerificationUser, changeEmail } = require('../Mail/UserMail')
const { errorHandlingdata } = require('../error/errorHandling')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { uploadProdileImg, deleteProfileImg } = require('../Images/UploadImg')
const dotenv = require('dotenv');
dotenv.config();

exports.CreateUser = async (req, res) => {
    try {
        const data = req.body;

        if (Object.keys(data).length === 0) return res.status(400).send({ status: false, msg: 'Data is empty' });

        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        data.Varification = data.Varification || {};
        data.Varification.user = data.Varification.user || {};
        data.Varification.Admin = data.Varification.Admin || {};
        data.role = 'user';
        data.Varification.user.userOtp = randomOtp;
        const existingUser = await userModel.findOneAndUpdate({ email: data.email }, { $set: { 'Varification.user.userOtp': randomOtp } }).select('+Varification');

        if (existingUser) {
            const DBDATABASE = { name: existingUser.name, email: existingUser.email, _id: existingUser._id }

            const userVerification = existingUser.Varification?.user || {};
            const adminVerification = existingUser.Varification?.Admin || {};

            if (userVerification.isDeleted) return res.status(400).send({ status: false, msg: 'User already deleted' });
            if (userVerification.isVerify) return res.status(400).send({ status: false, msg: 'Account already verified, please login' });
            if (!adminVerification.isAccountActive) return res.status(400).send({ status: false, msg: 'User is blocked by admin' });

            otpVerificationUser(existingUser.name, existingUser.email, randomOtp);
            return res.status(200).send({ status: true, msg: 'OTP sent successfully', data: DBDATABASE });
        }
        otpVerificationUser(data.name, data.email, randomOtp);
        const newUser = await userModel.create(data);

        const newDB = { name: newUser.name, email: newUser.email, _id: newUser._id }

        return res.status(201).send({ status: true, msg: 'User created successfully', data: newDB });

    } catch (e) { errorHandlingdata(e, res) }
};

exports.UserOtpVerify = async (req, res) => {
    try {

        const otp = req.body.otp;
        const id = req.params.id;

        if (!otp) return res.status(400).send({ status: true, msg: "pls Provide OTP" });

        const user = await userModel.findById(id);

        if (!user) return res.status(400).send({ status: true, msg: "User not found" });
        const dbOtp = user.Varification.user.userOtp;
        if (!(dbOtp == otp)) return res.status(400).send({ status: true, msg: "Wrong otp" });

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { 'Varification.user.isVerify': true } }, { new: true });
        res.status(200).send({ status: true, msg: "User Verify successfully" });

    }
    catch (e) { errorHandlingdata(e, res) }
}

exports.resendOtp = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await userModel.findById(id);
        if (!user) return res.status(400).send({ status: true, msg: "User not found" });

        const randomOtp = Math.floor(1000 + Math.random() * 9000);

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { 'Varification.user.userOtp': randomOtp } }, { new: true });
        otpVerificationUser(user.name, user.email, randomOtp);
        res.status(200).send({ status: true, msg: "OTP sent successfully" });
    } catch (e) { errorHandlingdata(e, res) }
}

exports.LogInUser = async (req, res) => {
    try {
        const data = req.body;
        const { email, password } = data;

        const existingUser = await userModel.findOne({ email: email, role: 'user' });

        if (!existingUser) return res.status(400).send({ status: false, msg: "User Not Found" });

        data.Varification = data.Varification || {};
        data.Varification.user = data.Varification.user || {};
        data.Varification.Admin = data.Varification.Admin || {};

        const comparePass = await bcrypt.compare(password, existingUser.password);
        if (!comparePass) return res.status(400).send({ status: false, msg: "Wrong Password" });

        if (existingUser) {
            // const DBDATABASE = { name: existingUser.name, email: existingUser.email, _id: existingUser._id }

            const userVerification = existingUser.Varification?.user || {};
            const adminVerification = existingUser.Varification?.Admin || {};

            if (userVerification.isDeleted) return res.status(400).send({ status: false, msg: 'User already deleted' });
            if (!userVerification.isVerify) return res.status(400).send({ status: false, msg: 'pls Verify Your Otp' });
            if (!adminVerification.isAccountActive) return res.status(400).send({ status: false, msg: 'User is blocked by admin' });
        }

        const token = jwt.sign({ userId: existingUser._id }, process.env.JWT_User_SECRET_KEY, { expiresIn: '1d' });

        const UserDB ={
            userProfileImg: existingUser.profileImg,
            name: existingUser.name,
            email: existingUser.email,}
        return res.status(200).send({ status: true, msg: 'Login successfully', data: { token, id: existingUser._id,UserDB } });





    }
    catch (e) { errorHandlingdata(e, res) }
}

exports.getUserById = async (req, res) => {
    try {
        const id = req.params.id
        const DB = await userModel.findById(id)
        if (!DB) return res.status(400).send({ status: false, msg: 'Data Not Found' })
        return res.status(200).send({ status: true, data: DB })
    }
    catch (e) { errorHandlingdata(e, res) }
}

exports.userDelete = async (req, res) => {
    try {
        const id = req.params.id;

        const user = await userModel.findById(id);
        if (!user) return res.status(400).send({ status: true, msg: "User not found" });


        await userModel.findByIdAndUpdate({ _id: id }, { $set: { 'Varification.user.isDeleted': true } });

        res.status(200).send({ status: true, msg: "Account Deleted successfully" });

    } catch (e) { errorHandlingdata(e, res) }
}

exports.userupdated = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body

        const { name } = data;

        const user = await userModel.findById(id);
        if (!user) return res.status(400).send({ status: true, msg: "User not found" });

        const DB = await userModel.findByIdAndUpdate({ _id: id }, { $set: { name: name } }, { new: true });

        const DBDATA = { name: DB.name, email: DB.email, _id: DB._id }

        res.status(200).send({ status: true, msg: "Account Updated successfully", data: DBDATA });

    } catch (e) { errorHandlingdata(e, res) }
}

exports.changePassword = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;

        const { currentPassword, newPassword } = data;

        if (currentPassword == newPassword) return res.status(400).send({ status: false, msg: "not provide same password" });

        const user = await userModel.findById(id);
        if (!user) return res.status(400).send({ status: true, msg: "User not found" });

        const bcryptPass = await bcrypt.compare(currentPassword, user.password);
        if (!bcryptPass) return res.status(400).send({ status: true, msg: "Wrong Password" });

        const hashPassword = await bcrypt.hash(newPassword, 10);

        await userModel.findByIdAndUpdate({ _id: id }, { $set: { password: hashPassword } });

        res.status(200).send({ status: true, msg: "Password Updated successfully" });

    } catch (e) { errorHandlingdata(e, res) }
}

exports.uploadProfileImg = async (req, res) => {
    try {
        const { id } = req.params;
        const file = req.file; 

        if (!file) return res.status(400).send({ status: false, msg: "Please provide file" });

        const user = await userModel.findById(id);

        if (!user) return res.status(400).send({ status: false, msg: "User not found" });

        if (user.profileImg?.public_id) await deleteProfileImg(user.profileImg.public_id);

        const newImgUrl = await uploadProdileImg(file.path);

        const updatedUser = await userModel.findByIdAndUpdate(id, { $set: { profileImg: newImgUrl } }, { new: true });

        const responseData = { _id: updatedUser._id, name: updatedUser.name, email: updatedUser.email, profileImg: updatedUser.profileImg };

        return res.status(200).send({ status: true, msg: "Profile updated successfully", data: responseData });

    }
    catch (e) { errorHandlingdata(e, res); }
};

exports.newEmail = async (req, res) => {
    try {
        const id = req.params.id;
        const data = req.body;
        const { password, newEmail } = data
        const existingUser = await userModel.findById(id);

        const existingEmail = await userModel.findOne({ email: newEmail, role: 'user' });
        if (existingEmail) return res.status(400).send({ status: false, msg: "Email already Register" });

        data.Varification = {};
        data.Varification.user = {};
        data.Varification.Admin = {};

        const comparePass = await bcrypt.compare(password, existingUser.password);
        if (!comparePass) return res.status(400).send({ status: false, msg: "Wrong Password" });

        if (existingUser) {
            const userVerification = existingUser.Varification?.user || {};
            const adminVerification = existingUser.Varification?.Admin || {};

            if (userVerification.isDeleted) return res.status(400).send({ status: false, msg: 'User already deleted' });
            if (!adminVerification.isAccountActive) return res.status(400).send({ status: false, msg: 'User is blocked by admin' });
        }

        const randomOtp = Math.floor(1000 + Math.random() * 9000);
        const expireTime = Math.floor((Date.now() + 5 * 60 * 1000) / 1000);

        await userModel.findByIdAndUpdate({ _id: id },
            {
                $set: {
                    'Varification.email.newEmail': newEmail,
                    'Varification.email.userOtp': randomOtp,
                    'Varification.email.expireTime': expireTime
                }
            },
            { new: true }
        );

        changeEmail(existingUser.name, newEmail, randomOtp);
        res.status(200).send({ status: true, msg: "OTP sent successfully" });
    }
    catch (e) { errorHandlingdata(e, res) }
}

exports.newEmailVerify = async (req, res) => {
    try {
        const otp = req.body.otp;
        const id = req.params.id;

        const existingId = await userModel.findById(id);
        if (!existingId) return res.status(400).send({ status: false, msg: "User not found" });

        const nowTime = Math.floor((Date.now()) / 1000);
        const DBTime = existingId.Varification.email.expireTime

        if (nowTime >= DBTime) return res.status(400).send({ status: false, msg: "OTP Expired" });

        if (otp == existingId.Varification.email.userOtp) {
            await userModel.findByIdAndUpdate({ _id: id },
                { $set: { email: existingId.Varification.email.newEmail, 'existingId.Varification.email.newEmail': '' } });
            res.status(200).send({ status: true, msg: "Email Verify successfully" });
        }
        else {
            res.status(400).send({ status: false, msg: "Wrong OTP" });
        }

    }
    catch (e) { errorHandlingdata(e, res) }
}