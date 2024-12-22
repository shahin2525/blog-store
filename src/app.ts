import express from 'express';
import cors from 'cors';
import errorHandler from './app/middlewares/errorHandler';
import { UserRoutes } from './app/modules/user/user.routes';
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// user route
app.use('/api/', UserRoutes);
// global error handler
app.use(errorHandler);
// not found route
app.all('*', (req, res) => {
  res.status(404).send('<h1>404! Page not found</h1>');
});
export default app;
