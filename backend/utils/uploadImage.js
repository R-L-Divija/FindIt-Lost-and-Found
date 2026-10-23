
const cloudinary = require("../config/cloudinary");

const uploadImage = (buffer) => {
    return new Promise((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream(
            {
                folder: "findit/items",
                resource_type: "image",
            },
            (error, result) => {
                if (error) {
                    return reject(error);
                }

                resolve({
                    imageUrl: result.secure_url,
                    imagePublicId: result.public_id,
                });
            }
        );

        stream.end(buffer);
    });
};

module.exports = uploadImage;
