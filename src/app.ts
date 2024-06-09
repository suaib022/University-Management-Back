import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes';
const app: Application = express();

app.use(express.json());
app.use(cors());

app.use('/api/v1', router);

const test = (req: Request, res: Response) => {
  const a = 10;

  res.send(a);
};

app.get('/', test);

app.use(globalErrorHandler);
app.use(notFound);

// app.listen(port, () => {
//   console.log(`Example app listening on port ${port}`);
// });

export default app;
