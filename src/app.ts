import cors from 'cors';
import express from 'express';
import errorHandler from './app/middlewares/errorHandler';
import router from './app/routes';
const app = express();
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello World!');
});
// route

app.use('/api/', router);
// global error handler
app.use(errorHandler);
// not found route
app.all('*', (req, res) => {
  res.status(404).send('404! Page not found');
});
export default app;
