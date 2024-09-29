import crypto from 'crypto';
import dayjs from 'dayjs';

const generateUniqueDeviceId = (): string => {
    return crypto.randomBytes(16).toString('hex');
};

const convertToUTC = ({
    dateTime,
    timezone,
}: {
    dateTime: string;
    timezone: string;
}): Date => {
    return dayjs.tz(dateTime, timezone).utc().toDate();
};

export { convertToUTC, generateUniqueDeviceId };
