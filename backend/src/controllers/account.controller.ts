import { Request, Response } from 'express';
import { AccountService } from '../services/account.service';
import { AccountStatus } from '../entities/Account.entity';


export class AccountController {
  private accountService: AccountService;

  constructor() {
    this.accountService = new AccountService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { documentNumber, status } = req.body;

      if (!documentNumber || typeof documentNumber !== 'string') {
        res.status(400).json({ error: 'documentNumber es requerido' });
        return;
      }

      const account = await this.accountService.create({
        documentNumber: documentNumber.trim(),
        status: status || AccountStatus.ACTIVE,
      });

      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const { customerId } = req.query;

      if (customerId && typeof customerId === 'string') {
        const account = await this.accountService.findByCustomerId(customerId);

        if (!account) {
          res.status(404).json({ error: 'El cliente no tiene cuenta' });
          return;
        }

        res.json(account);
        return;
      }

      const accounts = await this.accountService.findAll();
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
