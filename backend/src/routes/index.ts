import { Router } from 'express';
import pingController from '../controllers';
import getUserIdentityMiddleware from '../middlewares/validate-user.middleware';
import taskRouter from './task.routes';

const router = Router();

router.get('/', pingController);
router.use('/task', getUserIdentityMiddleware, taskRouter);

export default router;
