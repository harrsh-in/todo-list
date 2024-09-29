import { Server as SocketServer } from 'socket.io';
import { Server } from 'http';
import logger from '../utils/logger';

class SocketInstance {
    private static instance: SocketServer;

    private constructor() {}

    public static init(server: Server): SocketServer {
        if (!SocketInstance.instance) {
            SocketInstance.instance = new SocketServer(server, {
                cors: {
                    origin: '*',
                },
            });
            logger.info('Socket server initialized...');

            SocketInstance.instance.on('connection', (socket) => {
                logger.info(`A user ${socket.id} connected...`);

                socket.on('disconnect', () => {
                    logger.info(`User ${socket.id} disconnected...`);
                });
            });
        }
        return SocketInstance.instance;
    }

    public static getInstance(): SocketServer {
        if (!SocketInstance.instance) {
            throw new Error(
                'Socket has not been initialized. Call init() first.'
            );
        }
        return SocketInstance.instance;
    }

    public static close(): Promise<void> {
        return new Promise((resolve, reject) => {
            if (SocketInstance.instance) {
                SocketInstance.instance.close((err) => {
                    if (err) {
                        return reject(err);
                    }
                    logger.info('Socket server disconnected...');
                    resolve();
                });
            } else {
                resolve();
            }
        });
    }
}

export const socket = SocketInstance;
