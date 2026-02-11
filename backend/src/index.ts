import 'reflect-metadata'; // ⚠️ IMPORTANTE: Debe ser lo primero para que TypeORM funcione
import express from 'express';
import cors from 'cors';
import * as dotenv from 'dotenv';
import { AppDataSource, setupAccountNumberSequence } from './config/data-source';
import customerRoutes from './routes/customer.routes';
import accountRoutes from './routes/account.routes';


dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;


app.use(cors());


app.use(express.json());

app.use('/api/customers', customerRoutes);
app.use('/api/accounts', accountRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'API Banco - Prueba Técnica',
    endpoints: {
      customers: '/api/customers',
      accounts: '/api/accounts'
    }
  });
});

AppDataSource.initialize()
  .then(async () => {
    console.log('✅ Base de datos conectada correctamente');
    

    await setupAccountNumberSequence();
    
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en http://localhost:${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error al conectar la base de datos:', error);
    process.exit(1);
  });
