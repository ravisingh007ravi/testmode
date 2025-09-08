const ProductModel = require('../Model/productModel')
const { errorHandlingdata } = require('../error/errorHandling')
const { uploadProduct, deleteProfileImg } = require('../Images/UploadImg')

exports.createProduct = async (req, res) => {
    try {
        const data = req.body;
        const file = req.file;

        if (!file) return res.status(400).send({ status: false, msg: "Please provide file" });

        const checktitle = await ProductModel.findOne({ title: data.title });

        if (checktitle) {
            await deleteProfileImg(checktitle.productImg.public_id);
            data.productImg = await uploadProduct(file.path);
        }
        else {
            data.productImg = await uploadProduct(file.path);
        }


        const db = await ProductModel.create(data);
        res.status(201).send({ status: true, msg: "Product created successfully", data: db })
    }
    catch (err) {
        errorHandlingdata(err, res)
    }
}

exports.getAllProduct = async (req, res) => {
    try {
        const type = req.params.type
        if (type == 'all') {
            const allDB = await ProductModel.find().select({ isdeleted: 0, updatedAt: 0 }).sort({ createdAt: -1 })

            if (!allDB) return res.status(400).send({ status: false, msg: "No Product Found" })
            res.status(200).send({ status: true, msg: "Get All Product", data: allDB })
        }
        else {
            const allDB = await ProductModel.findById(type).select({ isdeleted: 0, createdAt: 0, updatedAt: 0 })

            if (!allDB) return res.status(400).send({ status: false, msg: "No Product Found" })
            res.status(200).send({ status: true, msg: "Get Product", data: allDB })
        }
    }
    catch (err) {
        errorHandlingdata(err, res)
    }
}