import { Request, Response } from 'express';
import { DocumentType } from '../entities/Customer.entity';
import { CustomerService } from '../services/customer.service';

const VALID_DOCUMENT_TYPES: string[] = Object.values(DocumentType);

export class CustomerController {
  private customerService: CustomerService;

  constructor() {
    this.customerService = new CustomerService();
  }

  create = async (req: Request, res: Response): Promise<void> => {
    try {
      const { documentType, documentNumber, fullName, email } = req.body;

      if (!documentNumber || !email || !fullName) {
        res.status(400).json({
          error: 'documentNumber, fullName y email son requeridos',
        });
        return;
      }
      if (!documentType || !VALID_DOCUMENT_TYPES.includes(documentType)) {
        res.status(400).json({
          error: `documentType debe ser uno de: ${VALID_DOCUMENT_TYPES.join(', ')}`,
        });
        return;
      }

      const customer = await this.customerService.create({
        documentType: documentType as DocumentType,
        documentNumber,
        fullName,
        email,
      });

      res.status(201).json(customer);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  };

  findAll = async (req: Request, res: Response): Promise<void> => {
    try {
      const customers = await this.customerService.findAll();
      res.json(customers);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  };
}
