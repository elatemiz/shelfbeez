
const multer = require("multer");
const path = require("path");

// Determine where uploaded images will be stored.
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, path.join(__dirname, "../../uploads/avatars"));
    },

    //It generates a unique filename for each photo, ensuring that photos with the same name do not overwrite one another.
    filename: function(req, file, cb) {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}`;
        const extension = path.extname(file.originalname).toLowerCase();

        cb(null, `${uniqueName}${extension}`);
    }
});

// Accept image files only.
function fileFilter(req, file, cb) {
    if (file.mimetype.startsWith("image/")) {
        cb(null, true);
    } else {
        cb(new Error("Only image files are allowed."));
    }
}

const upload = multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
        fileSize: 2 * 1024 * 1024
    }
});

module.exports = upload;
