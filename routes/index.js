import Router from 'express';
import findLink from '../controllers/homeController.js';

const router = new Router();

router.get('*', findLink);

export default router;