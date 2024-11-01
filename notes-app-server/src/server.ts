import { PrismaClient } from "@prisma/client";
import cors from "cors";
import express from "express";

const app = express();
const port: number = 5000;
const prisma = new PrismaClient();

app.use(express.json());
app.use(cors());

async function checkConnection() {
  try {
    await prisma.$connect(); // Attempt to connect to the database
    console.log("Connected to the database successfully!");
  } catch (error) {
    console.error("Failed to connect to the database:", error);
  } finally {
    await prisma.$disconnect(); // Disconnect after checking
  }
}

checkConnection();



app.get("/api/notes", async (req, res) => {
  try {
    const notes = await prisma.note.findMany();
    res.json(notes);
  } catch (error) {
    console.log("Error fetching notes:", error);
    res.status(500).send("internal server error");
  }
})

app.post("/api/notes", async (req, res) => {
  const { title, content } = req.body;

  // if (!title || !content) {
  //   res.status(400).send("Title and content fields are required");
  //   return;
  // }

  try {
    const note = await prisma.note.create({
      data: { title, content }
    });
    res.json(note);
  } catch (error) {
    console.error("Error creating note:", error);
    res.status(500).send("Internal Server Error");
  }
})

app.put("/api/notes/:id", async (req, res) => {
  const { title, content } = req.body;
  const id = parseInt(req.params.id);

  if (!title || !content) {
    res.status(400).send("Title and content fields required");
  }

  if (isNaN(id)) {
    res.status(400).send("ID must be valid number");
  }

  try {
    const updatedNote = await prisma.note.update({
      where: { id },
      data: { title, content }
    });
    res.json(updatedNote)
  } catch (error) {
    console.error("Error updating note:", error);
    res.status(500).send("Internal Server Error");
  }
})

app.delete("/api/notes/:id", async (req, res) => {
  const id = parseInt(req.params.id);

  if (isNaN(id)) {
    res.status(400).send("Invalid ID");
  }

  try {
    await prisma.note.delete({
      where: { id },
    });
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting note:", error);
    res.status(500).send("Internal Server Error");
  }
})

app.listen(port, () => {
  console.log(`Server is runing on localhost:${port}`)
})