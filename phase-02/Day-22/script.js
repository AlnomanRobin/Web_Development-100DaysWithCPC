const noteInput = document.getElementById("noteInput");
const addNoteBtn = document.getElementById("addNoteBtn");
const notesContainer = document.getElementById("notesContainer");

// Load saved notes
let notes = JSON.parse(localStorage.getItem("notes")) || [];
renderNotes();

addNoteBtn.addEventListener("click", addNote);

function addNote() {
  const text = noteInput.value.trim();
  if (text === "") return;

  const note = {
    id: Date.now(),
    content: text
  };

  notes.push(note);
  saveNotes();
  renderNotes();
  noteInput.value = "";
}

function renderNotes() {
  notesContainer.innerHTML = "";
  notes.forEach((note) => {
    const div = document.createElement("div");
    div.classList.add("note");

    const p = document.createElement("p");
    p.textContent = note.content;

    const btnDiv = document.createElement("div");
    btnDiv.classList.add("note-btns");

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");
    editBtn.addEventListener("click", () => editNote(note.id));

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");
    deleteBtn.addEventListener("click", () => deleteNote(note.id));

    btnDiv.appendChild(editBtn);
    btnDiv.appendChild(deleteBtn);

    div.appendChild(p);
    div.appendChild(btnDiv);
    notesContainer.appendChild(div);
  });
}

function editNote(id) {
  const note = notes.find((n) => n.id === id);
  const newContent = prompt("Edit your note:", note.content);
  if (newContent !== null && newContent.trim() !== "") {
    note.content = newContent;
    saveNotes();
    renderNotes();
  }
}

function deleteNote(id) {
  notes = notes.filter((n) => n.id !== id);
  saveNotes();
  renderNotes();
}

function saveNotes() {
  localStorage.setItem("notes", JSON.stringify(notes));
}
