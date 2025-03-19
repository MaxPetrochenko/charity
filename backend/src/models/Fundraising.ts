import mongoose, { Document, Schema } from "mongoose";

export interface IFundraising extends Document {
  title: string;
  description: string;
  goal: string;
  creator: mongoose.Types.ObjectId;
  approved: boolean;
}

const fundraisingSchema: Schema<IFundraising> = new Schema({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  goal: {
    type: String,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  approved: {
    type: Boolean,
    default: false,
  },
});

const Fundraising = mongoose.model<IFundraising>(
  "Fundraising",
  fundraisingSchema
);

export default Fundraising;
