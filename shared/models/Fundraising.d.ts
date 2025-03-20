import mongoose, { Document } from "mongoose";
export interface IFundraising extends Document {
    title: string;
    description: string;
    goal: string;
    creator: mongoose.Types.ObjectId;
    status: FundraisingStatusEnum;
}
export declare enum FundraisingStatusEnum {
    Pending = "pending",
    Dismissed = "dismissed",
    ApprovedByManagers = "approvedByManagers",
    Complete = "complete",
    ApprovedByWithdrawers = "approvedByWithdrawers",
    Withdrawn = "withdrawn"
}
export default IFundraising;
