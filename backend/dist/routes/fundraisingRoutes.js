"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Fundraising_1 = __importDefault(require("../models/Fundraising"));
const router = express_1.default.Router();
// Create new fundraising
router.post('/create', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { title, description, goal } = req.body;
    const userId = req.user.id; // From JWT token (middleware will check)
    try {
        const fundraising = new Fundraising_1.default({
            title,
            description,
            goal,
            creator: userId,
        });
        yield fundraising.save();
        res.status(201).json(fundraising);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}));
// Approve a fundraising
router.put('/approve/:id', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const { userId, role } = req.user; // From JWT token
    if (role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized' });
    }
    try {
        const fundraising = yield Fundraising_1.default.findById(id);
        if (!fundraising) {
            return res.status(404).json({ message: 'Fundraising not found' });
        }
        fundraising.approved = true;
        yield fundraising.save();
        res.json(fundraising);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}));
// Get all approved fundraisers
router.get('/approved', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const fundraisers = yield Fundraising_1.default.find({ approved: true }).populate('creator');
        res.json(fundraisers);
    }
    catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
}));
exports.default = router;
