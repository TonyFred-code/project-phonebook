import express from "express";
import { dirname, join } from "path";
import { fileURLToPath } from "url";
import { indexRouter } from "./routes/indexRouter.js";
import { contactsRouter } from "./routes/contactsRouter.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();

app.use(express.static(join(__dirname, "public")));

app.set("views", join(__dirname, "views"));
app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));

app.use("/contacts", contactsRouter);
app.use("/", indexRouter);

app.use((req, res, next) => {
  res.status(404).render("404");
});

// **Error-handling middleware**
app.use((err, req, res, next) => {
  console.error(err);

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).render("errors", { message });
});

const PORT = process.env.PORT || 8000;

app
  .listen(PORT, () => {
    console.log(`Server listening on PORT: ${PORT}`);
  })
  .on("error", (error) => {
    console.error("Server failed to start with error: ", error);
  });
