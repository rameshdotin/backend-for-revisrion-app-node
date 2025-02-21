import { Router } from 'express'
import { userSignIn, userSignUp } from '../controllers/authController.js';

const route = Router();

route.post('/signup', userSignUp)
route.post('/signin', userSignIn)

export default route;