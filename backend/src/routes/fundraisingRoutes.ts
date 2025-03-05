import express, { Request, Response } from 'express';
import Fundraising from '../models/Fundraising';
import User from '../models/User';
import { IUser } from '../models/User';
import { IUserRequest } from '../middleware/authMiddleware';

const router = express.Router();

// Create new fundraising
router.post('/create', async (req: Request, res: Response) => {
  const { title, description, goal } = req.body;
  const userId = (req as IUserRequest).user.id; // From JWT token (middleware will check)

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
    res.status(500).json({ message: 'Server Error' });
  }
});

// Approve a fundraising
router.put('/approve/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { userId, role } = (req as IUserRequest).user; // From JWT token

  if (role !== 'admin') {
    return res.status(403).json({ message: 'Not authorized' });
  }

  try {
    const fundraising = await Fundraising.findById(id);
    if (!fundraising) {
      return res.status(404).json({ message: 'Fundraising not found' });
    }

    fundraising.approved = true;
    await fundraising.save();

    res.json(fundraising);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Get all approved fundraisers
router.get('/approved', async (req: Request, res: Response) => {
  try {
    const fundraisers = await Fundraising.find({ approved: true }).populate('creator');
    res.json(fundraisers);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
