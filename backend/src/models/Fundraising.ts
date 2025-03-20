import mongoose, { Schema } from "mongoose";
import { IFundraising, FundraisingStatusEnum } from "shared/models/Fundraising";

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
