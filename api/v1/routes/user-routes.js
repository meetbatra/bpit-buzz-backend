import express from 'express'
import { getCertificates, getUserEvents, getUsers, login, loginWithGoogle, register, signup } from '../../../controllers/user-controller.js';
import { checkToken, verifyAdmin } from '../../../utils/middlewares/auth.js';

const router = express.Router();

router.post('/signup', signup);

router.post('/login', login);

router.post('/google', loginWithGoogle);

router.get('/all', verifyAdmin, getUsers);

router.post('/register', checkToken, register);

router.post('/certificates', checkToken, getCertificates);

router.post('/events', checkToken, getUserEvents);

export default router;