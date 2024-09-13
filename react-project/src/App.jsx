import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faPlus } from '@fortawesome/free-solid-svg-icons';
import './App.css'

function App() {
  const [notes, setNotes] = useState(() => {
    // Load from localStorage during initial render
    const savedNotes = localStorage.getItem('notes');
    return savedNotes ? JSON.parse(savedNotes) : [];
  });
  const [color, setColor] = useState('#e6b905');

  // Save to localStorage whenever the notes change
  useEffect(() => {
    if (notes.length > 0) {
      localStorage.setItem('notes', JSON.stringify(notes));
    }
  }, [notes]);

  const addNote = () => {
    const newNote = {
      content: '',
      color,
      position: { left: '50px', top: '60px' }
    };
    setNotes((prevNotes) => [...prevNotes, newNote]);
    setColor('#e6b905');
  };

  const removeNote = (index) => {
    setNotes((prevNotes) => prevNotes.filter((_, i) => i !== index));
  };

  const updateNoteContent = (index, content) => {
    const updatedNotes = [...notes];
    updatedNotes[index].content = content;
    setNotes(updatedNotes);
  };

  const saveNotePosition = (index, left, top) => {
    const updatedNotes = [...notes];
    updatedNotes[index].position = { left, top };
    setNotes(updatedNotes);
  };

  return (
    <main>
      <form id="noteForm">
        <input type="color" value={color} onChange={(e) => setColor(e.target.value)} />
        <button type="button" className="addbtn" onClick={addNote}>
          <FontAwesomeIcon icon={faPlus} />
        </button>
      </form>

      <div id="list">
        {notes.map((note, index) => (
          <Note
            key={index}
            index={index}
            note={note}
            removeNote={removeNote}
            updateNoteContent={updateNoteContent}
            saveNotePosition={saveNotePosition}
          />
        ))}
      </div>
    </main>
  );
};

const Note = ({ note, index, removeNote, updateNoteContent, saveNotePosition }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setOffset({
      x: e.clientX - e.target.offsetLeft,
      y: e.clientY - e.target.offsetTop
    });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newLeft = `${e.clientX - offset.x}px`;
      const newTop = `${e.clientY - offset.y}px`;
      saveNotePosition(index, newLeft, newTop);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  return (
    <div
      className="note"
      style={{ left: note.position.left, top: note.position.top, borderTop: `30px solid ${note.color}` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
    >
      <span className="close" onClick={() => removeNote(index)}>
        <FontAwesomeIcon icon={faTimes} />
      </span>
      <textarea
        placeholder="Write Content..."
        rows="10"
        cols="30"
        value={note.content}
        onChange={(e) => updateNoteContent(index, e.target.value)}
      />
    </div>
  );
};
export default App
