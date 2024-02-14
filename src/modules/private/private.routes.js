import { Router } from 'express';
import { verifyToken } from '../../middlewares/user.middleware.js';
const router = Router({ mergeParams: true });

//!PATH - /private

/**
 * @swagger
 * 
 * /private:
 *  get:
 *   description: Get all private data
 *   tags:
 *      - Private
 *   produces:
 *     - application/json
 *   consumes:
 *    - application/json
 *   responses:
 *    '200':
 *      description: GET request successful
 *    '40X':
 *      description: Error in the request  
 */
router
    .route("/")
    .get(verifyToken, (req, res) => {
        console.log(req.user);
        res.status(200).send("Welcome to the private route");
    })

export default router;