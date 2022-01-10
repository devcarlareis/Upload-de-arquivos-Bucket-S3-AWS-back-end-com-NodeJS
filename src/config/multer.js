const multer = require('multer');
const path = require('path');
const crypto = require('crypto')
const aws = require('aws-sdk')
const multerS3 = require('multer-s3')

const storageTypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(__dirname, '..', '..', 'tmp', 'uploads'));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if(err) cb(err);

        file.key = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, file.key);
      });
    },
  }),

  s3: multerS3({
    s3: new aws.S3(),
    bucket: 'nome do bucket',
    contentType: multerS3.AUTO_CONTENT_TYPE, //ler o tipo do arquivo e vai atribuir como c para abrir o arquivo no navegador, para evitar forçar o download
    acl: 'public-read',
    key: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if(err) cb(err);

        const fileName = `${hash.toString('hex')}-${file.originalname}`;
        cb(null, fileName);
      });
    }
  })
};

module.exports = {
  dest: path.resolve(__dirname, '..', '..', 'tmp', 'uploads'),
  storage: storageTypes[process.env.STORAGE_TYPE],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const alloweedeNimes = [
      'image/jpeg',
      'image/pjpeg',
      'image/png',
      'image/gif'
    ];
    if (alloweedeNimes.includes(file.mimetype)){
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'))
    }
  }
}