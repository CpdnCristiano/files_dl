import express, { NextFunction } from 'express';

import { Router, Request, Response } from 'express';
import { setupSwagger } from './swagger';
import downloadRouter from './routes/download.router';
import { configDotenv } from 'dotenv';

configDotenv();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = process.env.PUBLIC_DIR || 'public';
const app = express();
app.use(`/${PUBLIC_DIR}`, express.static(PUBLIC_DIR));

const route = Router();

app.use(express.json());

setupSwagger(app);

route.use('/api', downloadRouter);

route.use((req: Request, res: Response, next: NextFunction) => {
  res.redirect('/docs');
});

app.use(route);

app.listen(PORT, () => `server running on port ${PORT}`);
