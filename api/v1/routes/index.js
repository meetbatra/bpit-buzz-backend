import express from "express"
import userRouter from "./user-routes.js"
import eventRouter from "./event-routes.js";

const router = express.Router()

router.use('/user', userRouter);

router.use('/event', eventRouter)

export default router;