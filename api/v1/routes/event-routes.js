import express from 'express'
import { addEvent, getEvents, getRegisteredUsers, markAttendance } from '../../../controllers/event-controller.js';
import { verifyAdmin } from '../../../utils/middlewares/auth.js';

const router = express.Router();

router.post('/new', verifyAdmin, addEvent);

router.get('/all', getEvents);

router.post('/users', verifyAdmin, getRegisteredUsers);

router.post('/attendance', verifyAdmin, markAttendance);

export default router;