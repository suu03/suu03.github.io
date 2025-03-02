"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("react-dom/client");
const react_1 = __importDefault(require("react"));
const react_2 = require("react");
const App_1 = __importDefault(require("./App"));
require("./index.css");
(0, client_1.createRoot)(document.getElementById("root")).render(react_1.default.createElement(react_2.StrictMode, null,
    react_1.default.createElement(App_1.default, null)));
