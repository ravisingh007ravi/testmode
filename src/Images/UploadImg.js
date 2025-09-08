const cloudinary = require('cloudinary').v2;
const dotenv = require('dotenv')
dotenv.config()

cloudinary.config({
    cloud_name: process.env.Cloud_Name,
    api_key: process.env.API_Key,
    api_secret: process.env.API_Secret
});


exports.uploadProdileImg = async (file) => {
    try {

        const uploadResult = await cloudinary.uploader.upload(file);

        return { secure_url: uploadResult.secure_url, public_id: uploadResult.public_id }
    }
    catch (err) { console.log(err) }
}

exports.deleteProfileImg = async (id) => {
    try {
        await cloudinary.uploader.destroy(id);
    }
    catch (err) { console.log(err) }
}


exports.uploadProduct = async (file) => {
    try {

        const uploadResult = await cloudinary.uploader.upload(file);

        return { secure_url: uploadResult.secure_url, public_id: uploadResult.public_id }
    }
    catch (err) { console.log(err) }
}