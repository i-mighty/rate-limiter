import { Request, Response, NextFunction } from 'express';
import config from './config';
import jwt from 'jsonwebtoken';

const addAuth = async function(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (token) {
      jwt.verify(token, config.jwtSecret, function(err, decoded) {
        if (err) {
          return next(err);
        }
        if (decoded) {
          req.body.auth = decoded;
        }
      });
    }
    next();
  } catch (err) {
    res.status(401).json({
      message: 'Some error occurred.',
    });
  }
};

export default { addAuth };
