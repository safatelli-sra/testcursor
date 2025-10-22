import 'dotenv/config';
import express, { NextFunction, Request, Response } from 'express';
import cors from 'cors';
import { json } from 'express';
import rbacRouter from './routes/rbac';
import storesRouter from './routes/stores';
import toursRouter from './routes/tours';

const app = express();

app.use(cors());
app.use(json({ limit: '1mb' }));

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/rbac', rbacRouter);
app.use('/api/stores', storesRouter);
app.use('/api/tours', toursRouter);

// Not found handler
app.use((req, res) => {
  res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});

// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  // Avoid leaking internals
  res.status(500).json({ error: 'Internal server error' });
});

const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Server listening on http://localhost:${port}`);
});
