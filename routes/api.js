import Router from 'express';
import saveLink from '../controllers/apiController.js';

const router = new Router();

router.post('/data', saveLink);

export default router;
