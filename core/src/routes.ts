import express from 'express'
import multer from 'multer';
import path from 'path';
import { PessoaController } from './controllers/PessoaController';

const routes = express.Router();
const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, `${__dirname}/storage/images`)
  },
  filename: (req, file, cb) => {
    cb(null, req.params.id)
  }
})
const upload = multer({
  storage: storage 
})

routes
  .get('/pessoas', PessoaController.getAll)
  .put('/pessoas/:id', upload.single('file') , PessoaController.save)

export default routes