"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("tsconfig-paths/register");
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const fundraisingRoutes_1 = __importDefault(require("./routes/fundraisingRoutes"));
const authMiddleware_1 = require("./middleware/authMiddleware");
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
dotenv_1.default.config({ path: ".env" });
const app = (0, express_1.default)();
app.use((0, cors_1.default)({
    origin: "http://localhost:3000", // Allow frontend origin
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies/auth headers
}));
app.options("*", (0, cors_1.default)());
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((req, res, next) => {
    console.log(`Incoming request: ${req.method} ${req.url}`);
    console.log("Origin:", req.headers.origin);
    next();
});
mongoose_1.default
    //.connect(process.env.MONGO_URI!)
    .connect("mongodb://127.0.0.1:27017")
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));
app.use("/api/auth", authRoutes_1.default);
app.use("/api/fundraising", authMiddleware_1.protect, fundraisingRoutes_1.default);
app.get("/api/protected", (req, res) => {
    const token = req.cookies.token; // Get token from HTTP-only cookie
    const JWT_SECRET = process.env.JWT_SECRET;
    if (!token)
        return res.status(401).json({ message: "Unauthorized" });
    try {
        const decoded = jsonwebtoken_1.default.verify(token, JWT_SECRET);
        res.json({ message: "You accessed a protected route!", user: decoded });
    }
    catch (error) {
        return res.status(403).json({ message: "Invalid token" });
    }
});
app.post("/logout", (req, res) => {
    console.log("CAME TO LOGOUT");
    res.clearCookie("token", {
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production", // Use HTTPS in production
    });
    res.json({ message: "Logged out successfully" });
});
app.listen(process.env.PORT || 5000, () => {
    console.log(`Server running on port ${process.env.PORT || 5000}`);
});
