"use client";

import { FormEvent, useEffect, useState } from "react";

type Note = {
  id: number;
  title: string;
  content: string;
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);

  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/notes");
        const notes: Note[] = await response.json();
        const sortedNotes = notes.sort((a, b) => b.id - a.id);
        console.log(sortedNotes);
        setNotes(sortedNotes);
      } catch (e) {
        console.error("Error fetching notes:", e);
      }
    };

    fetchNotes();
  }, []);

  const handleAddNote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/notes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title, content }),
      });

      const newNote = await response.json();
      setNotes([newNote, ...notes]);
      setTitle("");
      setContent("");
    } catch (e) {
      console.error("Error adding note:", e);
    }
  };

  const handleNoteClick = (note: Note) => {
    setSelectedNote(note);
    setTitle(note.title);
    setContent(note.content);
  };

  const handleUpdateNote = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!selectedNote) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${selectedNote.id}`,
        {
          method: "PUT",
          headers: {
            "Content-type": "application/json",
          },
          body: JSON.stringify({ title, content }),
        }
      );

      const updateNote = await response.json();

      const updateNoteList = notes.map((note) =>
        note.id === selectedNote.id ? updateNote : note
      );

      setNotes(updateNoteList);
      setTitle("");
      setContent("");
      setSelectedNote(null);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCancel = () => {
    setTitle("");
    setContent("");
    setSelectedNote(null);
  };

  const deleteNote = async (
    event: React.MouseEvent<HTMLButtonElement>,
    noteId: number
  ) => {
    event.stopPropagation();

    try {
      const response = await fetch(
        `http://localhost:5000/api/notes/${noteId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok && response.status === 204) {
        const updatedNotes = notes.filter((note) => note.id !== noteId);
        setNotes(updatedNotes);
      } else {
        console.error("Failed to delete note.");
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="app-container m-5 md:grid md:grid-cols-[200px_1fr] md:gap-5">
      <form
        className="note-form flex flex-col gap-5"
        onSubmit={(event) =>
          selectedNote ? handleUpdateNote(event) : handleAddNote(event)
        }
      >
        {selectedNote ? (
          <div className="flex flex-col">
            <input
              className="border border-black rounded p-2 text-lg mb-2"
              placeholder={title === "" ? `Title` : title}
              onChange={(event) => setTitle(event.target.value)}
              required
            />
            <textarea
              className="border border-black rounded p-2 text-lg mb-2"
              placeholder={content === "" ? "Content" : content}
              onChange={(event) => setContent(event.target.value)}
              rows={10}
              required
            />
            <button
              type="submit"
              className="rounded bg-[#409AB8] p-2 text-lg text-white hover:bg-[#6AAFC6] mb-2"
            >
              Save
            </button>
            <button
              onClick={handleCancel}
              className="rounded bg-[#409AB8] p-2 text-lg text-white hover:bg-[#6AAFC6]"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            type="submit"
            className="rounded bg-[#409AB8] p-2 text-lg text-white hover:bg-[#6AAFC6]"
          >
            Add Note
          </button>
        )}
      </form>

      <div className="notes-grid grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] auto-rows-[minmax(250px,auto)] gap-5">
        {notes.map((note) => (
          <div
            key={note.id}
            className={
              selectedNote !== null && selectedNote.id === note.id
                ? `border-4 border-violet-300`
                : `border-0`
            }
          >
            <div
              className="note-item flex flex-col border border-gray-300 rounded bg-gray-100 shadow cursor-pointer p-2 h-full"
              onClick={() => handleNoteClick(note)}
            >
              <div className="notes-header flex justify-end">
                <button
                  className="text-lg bg-transparent border-none cursor-pointer"
                  onClick={(e) => deleteNote(e, note.id)}
                >
                  x
                </button>
              </div>
              <h2 className="m-0">{note.title}</h2>
              <p>{note.content}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
