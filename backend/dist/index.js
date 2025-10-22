"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_2 = require("express");
const rbac_1 = __importDefault(require("./routes/rbac"));
const stores_1 = __importDefault(require("./routes/stores"));
const tours_1 = __importDefault(require("./routes/tours"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use((0, express_2.json)({ limit: '1mb' }));
app.get('/health', (_req, res) => {
    res.json({ status: 'ok' });
});
app.use('/api/rbac', rbac_1.default);
app.use('/api/stores', stores_1.default);
app.use('/api/tours', tours_1.default);
// Not found handler
app.use((req, res) => {
    res.status(404).json({ error: `Route not found: ${req.method} ${req.path}` });
});
// Error handler
// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err, _req, res, _next) => {
    // Avoid leaking internals
    res.status(500).json({ error: 'Internal server error' });
});
const port = Number(process.env.PORT || 3000);
app.listen(port, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on http://localhost:${port}`);
});
