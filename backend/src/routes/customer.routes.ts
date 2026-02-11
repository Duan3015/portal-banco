import { Router } from 'express';
import { CustomerController } from '../controllers/customer.controller';

const router = Router();
const customerController = new CustomerController();

router.post('/', customerController.create);
router.get('/', customerController.findAll);

export default router;
