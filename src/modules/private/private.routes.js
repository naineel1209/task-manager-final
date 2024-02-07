import { Router } from 'express';
import { verifyToken } from '../../middlewares/user.middleware.js';
const router = Router({ mergeParams: true });

//!PATH - /private

router
    .route("/")
    .get(verifyToken, (req, res) => {
        console.log(req.user);
        res.status(200).send("Welcome to the private route");
    })

export default router;