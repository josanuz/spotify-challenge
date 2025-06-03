import express from 'express';
import cors from 'cors';
import { JWTMiddleware } from './middleware/jwtmiddleware';
import authRouter from './routes/auth';
import userRouter from './routes/user';
import searchRouter from './routes/search';
import podcastRouter from './routes/podcast';
import librabryRouter from './routes/lib';
import Enviroment from './config/enviroment';
import errorHandler from './middleware/error-handler';

const app = express();
const port = Enviroment.PORT;

app.use(express.json());
app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use('/api', JWTMiddleware());
app.use('/auth', authRouter);
app.use('/api/user', userRouter);
app.use('/api/search', searchRouter);
app.use('/api/podcast', podcastRouter);
app.use('/api/lib', librabryRouter);

// error handling middleware, should be the last middlewar
app.use(errorHandler);
// Do not add any routes after the error handler

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
