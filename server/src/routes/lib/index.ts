/**
 * Collets all the routes for the library module.
 * This module is responsible for handling library-related routes,
 * For this example, it includes routes for managing podcasts.
 */
import { Router } from 'express';
import podcastRouter from './podcast';

const router = Router();

router.use('/podcast', podcastRouter);

export default router;
