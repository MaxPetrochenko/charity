import express, { Request, Response } from "express";
import Fundraising from "../models/Fundraising";
import { FundraisingStatusEnum } from "shared/models/Fundraising";
import { IUserRequest } from "../middleware/authMiddleware";

const router = express.Router();

// Create new fundraising
router.post("/create", async (req: Request, res: Response) => {
  const { title, description, goal } = req.body;
  const userId = (req as IUserRequest).user.id; // From JWT token (middleware will check)
  //res.json(userId);
  try {
    const fundraising = new Fundraising({
      title,
      description,
      goal,
      creator: userId,
    });

    await fundraising.save();
    res.status(201).json(fundraising);
  } catch (error) {
    res.status(500).json(error);
  }
});

// Approve a fundraising
router.put("/approve/:id", async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, role } = (req as IUserRequest).user; // From JWT token

  if (role == "user") {
    return res.status(403).json({ message: "Not authorized" });
  }

  try {
    const fundraising = await Fundraising.findById(id);
    if (!fundraising) {
      return res.status(404).json({ message: "Fundraising not found" });
    }

    fundraising.status = FundraisingStatusEnum.Pending;
    await fundraising.save();

    res.json(fundraising);
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

// Get all approved fundraisers
router.post("/approved", async (req: Request, res: Response) => {
  try {
    console.log(req.body);
    const { requestStatuses } = req.body;
    const statuses = requestStatuses as FundraisingStatusEnum[];
    const fundraisers = await Fundraising.find({
      status: { $in: statuses },
    }).populate("creator");
    res.json(fundraisers);
    console.log("APPROVED");
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

export default router;
