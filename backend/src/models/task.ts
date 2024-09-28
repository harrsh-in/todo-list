import mongoose, { Document, Schema } from "mongoose";

export interface ITask extends Document {
  title: string;
  description: string;
  start_time: Date;
  end_time: Date;
  timezone: string;
  recurrence: any;
  next_occurrence: Date;
  is_active: boolean;
}

const TaskSchema: Schema = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  start_time: {
    type: Date,
    required: true,
  },
  end_time: {
    type: Date,
    required: true,
  },
  timezone: {
    type: String,
    required: true,
  },
  recurrence: {
    type: Object,
    required: true,
  },
  next_occurrence: {
    type: Date,
    required: true,
  },
  is_active: {
    type: Boolean,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const Task = mongoose.model<ITask>("Task", TaskSchema);
