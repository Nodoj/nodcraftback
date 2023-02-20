import express from 'express';
import fs from 'fs';
import multer from 'multer';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';

import { registerValidation, loginValidation, postCreateValidation, projectCreateValidation } from './validations.js';
import { handleValidationErrors, checkAuth } from './utils/index.js';
import { UserController, PostController, ProjectController } from './controllers/index.js';


dotenv.config();

mongoose.set('strictQuery', false)

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log('DB ok'))
  .catch((err) => console.log('DB error', err));

const app = express();

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    if (!fs.existsSync('uploads')) {
      fs.mkdirSync('uploads');
    }
    cb(null, 'uploads');
  },
  filename: (_, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

app.use(express.json());
app.use(cors());
app.use('/uploads', express.static('uploads'));

app.post('/auth/login', loginValidation, handleValidationErrors, UserController.login);
app.post('/auth/register', registerValidation, handleValidationErrors, UserController.register);
app.get('/auth/me', checkAuth, UserController.getMe);

app.post('/upload', checkAuth, upload.single('image'), (req, res) => {
  res.json({
    url: `/uploads/${req.file.originalname}`,
  });
});

app.get('/tags', PostController.getLastTags);


app.get('/projects', ProjectController.getAll);
app.get('/projects/:id', ProjectController.getOne);
app.post('/projects', checkAuth, projectCreateValidation, handleValidationErrors, ProjectController.create);
app.delete('/projects/:id', checkAuth, ProjectController.remove);
app.patch('/projects/:id', checkAuth, projectCreateValidation, handleValidationErrors, ProjectController.update,
);

app.get('/posts', PostController.getAll);
app.get('/posts/tags', PostController.getLastTags);
app.get('/posts/:id', PostController.getOne);
app.post('/posts', checkAuth, postCreateValidation, handleValidationErrors, PostController.create);
app.delete('/posts/:id', checkAuth, PostController.remove);
app.delete('/projects/:id', checkAuth, ProjectController.remove);
app.patch(
  '/posts/:id',
  checkAuth,
  postCreateValidation,
  handleValidationErrors,
  PostController.update,
);
app.patch(
  '/projects/:id',
  checkAuth,
  projectCreateValidation,
  handleValidationErrors,
  ProjectController.update,
);

app.listen(process.env.PORT || 4444, (err) => {
  if (err) {
    return console.log(err);
  }

  console.log('Server OK');
});


