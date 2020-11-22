const path = require("path");
const fs = require("fs");
const handleError = (err, res) => {
    res.status(500).send(err)
    return;
};

exports.uploadFile = (req) => {
    // upload file
    let tempPath = req.file.path;
    let targetPath = path.join(tempPath);

    if (req.file.mimetype === "image/png") {
        targetPath = targetPath + '.png';
        fs.rename(tempPath, (targetPath + '.png'), err => {
            if (err) return handleError(err, res);
            // res.status(200).contentType("text/plain").end("File uploaded!");
        });
    } else if (req.file.mimetype === "image/jpeg") {
        targetPath = targetPath + '.jpg';
        fs.rename(tempPath, targetPath, err => {
            if (err) return handleError(err, res);
            // res.status(200).contentType("text/plain").end("File uploaded!");
        });
    } else {
        fs.unlink(tempPath, err => {
            if (err) return handleError(err, res);

            res.status(403).contentType("text/plain").end("Only .png or .jpeg files are allowed!");
            return
        });
    }

    return path.join(__dirname, '../', targetPath);
}
