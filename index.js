const express = require('express')
const multer = require('multer')
const ejs = require('ejs')
const path = require('path')
const app = express()

//Set storage
const storage = multer.diskStorage({
    destination: './public/uploads',
    filename: function (req, file, cb) {
        cb(null, `${file.fieldname}-${Date.now()}-${path.extname(file.originalname)}`)
    }
})
//Init upload
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1000000
    },
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb)
    }

}).single('myImage');
//Check file type
function checkFileType(file, cb) {
    //Allowed extensions
    const fileTypes = /jpeg|jpg|png|gif/;
    //Check ext
    const extname = fileTypes.test(path.extname(file.originalname).toLowerCase());
    //Check mime
    const mimeType = fileTypes.test(file.mimetype)

    if (extname && mimeType) {
        return cb(null, true)
    } else {
        cb('Err: images only')
    }


}
app.set('view engine', 'ejs')
app.use(express.static('./public'))

app.get('/', (req, res, next) => {
    res.render('index')
})
app.post('/upload', (req, res) => {
    upload(req, res, (err) => {
        if (err) {
            res.render('index', {
                msg: err
            })
        } else {
            if (req.file == undefined) {
                res.render('index', {
                    msg: 'No file selected'
                })
            }else{
                res.render('index',{
                    msg:'File uploaded successfully',
                    file:`uploads/${req.file.filename}`
                })
            }
        }
    })
})

app.listen(4000, () => console.log(`Server running on port 3000`))
