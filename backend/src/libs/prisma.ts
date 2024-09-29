import { PrismaClient } from '@prisma/client';
import logger from '../utils/logger';

class PrismaInstance {
    private static instance: PrismaClient;

    private constructor() {}

    public static getInstance(): PrismaClient {
        if (!PrismaInstance.instance) {
            PrismaInstance.instance = new PrismaClient();
            logger.info('Prisma client initialized...');
        }
        return PrismaInstance.instance;
    }
}

export const prisma = PrismaInstance.getInstance();
