import moment from "moment-timezone";

export const calculateNextOccurrence = ({
  startTime,
  timezone,
  recurrenceRule,
}: {
  startTime: string;
  timezone: string;
  recurrenceRule: moment.DurationInputArg2;
}) => {
  const now = moment.tz(timezone);
  const nextOccurrence = moment.tz(startTime, timezone).add(1, recurrenceRule);

  return nextOccurrence.utc().toDate();
};
