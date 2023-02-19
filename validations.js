import { body } from 'express-validator';

export const loginValidation = [
  body('email', 'Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
];

export const registerValidation = [
  body('email', 'Invalid mail format').isEmail(),
  body('password', 'Password must be at least 5 characters').isLength({ min: 5 }),
  body('fullName', 'Enter a name').isLength({ min: 3 }),
  body('avatarUrl', 'Invalid avatar link').optional().isURL(),
];

export const postCreateValidation = [
  body('title', 'Enter article title').isLength({ min: 3 }).isString(),
  body('text', 'Enter article text').isLength({ min: 3 }).isString(),
  body('tags', 'Неверный формат тэгов').optional().isString(),
  body('imageUrl', 'Invalid image link').optional().isString(),
];

export const projectCreateValidation = [
  body('title', 'Enter Project title').isLength({ min: 3 }).isString(),
  body('text', 'Enter Project text').isLength({ min: 3 }).isString(),
  body('imageUrl', 'Invalid image link').optional().isString(),
];