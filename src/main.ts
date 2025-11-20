import express from "express";
import cors from "cors";
import helmet from "helmet";

import router from "./router";
import errorMiddleware from "./middlewares/error.middleware";

const app = express();


// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);


// Error Middleware
app.use(errorMiddleware);


app.listen(8000, () => {
    console.log("Server is running on port 8000");
});


