import { Router } from 'express';
import { AccountController } from '../controllers/account.controller';

const router = Router();
const accountController = new AccountController();

router.post('/', accountController.create);
router.get('/', accountController.findAll);

export default router;
