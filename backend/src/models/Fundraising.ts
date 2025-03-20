import mongoose, { Document, Schema } from "mongoose";

export interface IFundraising extends Document {
  title: string;
  description: string;
  goal: string;
  creator: mongoose.Types.ObjectId;
  status: FundraisingStatusEnum;
}
export enum FundraisingStatusEnum {
  Pending = "pending",
  Dismissed = "dismissed",
  ApprovedByManagers = "approvedByManagers",
  Complete = "complete",
  ApprovedByWithdrawers = "approvedByWithdrawers",
  Withdrawn = "withdrawn",
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
  status: {
    type: String,
    enum: Object.values(FundraisingStatusEnum),
    default: FundraisingStatusEnum.Pending,
  },
});

const Fundraising = mongoose.model<IFundraising>(
  "Fundraising",
  fundraisingSchema
);

export default Fundraising;
