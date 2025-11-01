import {  useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import plusLogo from './assets/plus.svg'
import springLogo from './assets/spring-boot.svg'
import './App.css'

function App() {
  
  const [notes, setNotes] = useState([])

  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')

  // Para editar notas
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    fetchNotes()
  }, [])

  const fetchNotes = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/notes')
      const data = await response.json()
      setNotes(data)
    } catch (error) {
      console.error('Error fetching notes:', error)
    }
  }

  const createNote = async () => {
    if (!title || !description) return alert('Title and Description are required')

    try {
      if (editingId) {
        // Editar nota existente
        await fetch(`http://localhost:8080/api/notes/${editingId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        })
        setEditingId(null)
      } else {
        // Crear nueva nota
        await fetch('http://localhost:8080/api/notes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, description }),
        })
      }

      setTitle('')
      setDescription('')
      fetchNotes()

    } catch (error) {
      console.error('Error creating note:', error)
    }
  }

  const deleteNote = async (id) => {
    if (!id) return
    try {
      await fetch(`http://localhost:8080/api/notes/${id}`, {
        method: 'DELETE',
      })
      fetchNotes()

      // Para limpiar el formulario si se estaba editando la nota eliminada
      if (editingId === id) {
        setTitle('')
        setDescription('')
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error deleting note:', error)
    }
  }

  const editNote = (note) => {
    if (!note) return
    setTitle(note.title)
    setDescription(note.description)
    setEditingId(note.id)
  }

  return (
    
      <div>
        <a href="https://spring.io" target="_blank" rel="noreferrer">
          <img src={springLogo} className="logo spring" alt="Spring Boot logo" />
        </a>
        <a >
          <img src={plusLogo} className="logo plus" alt="Plus logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      <div>
        <h1>App de notas</h1>

        <p>Web simple para ver, crear, editar y eliminar notas usando React y una API con Spring Boot</p>
      </div>
      <div className="form">
        <input
          type="text"
          placeholder="Título de la nota"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          onKeyDown={(e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
              e.preventDefault()
              createNote()
            }
          }}
        />
        <button onClick={createNote}>
          {editingId ? 'Guardar cambios' : 'Guardar'}
        </button>
      </div>

      <div className="notes">
        {
          notes.map((note) => (
            <div className={`note ${editingId === note.id ? 'editing' : ''}`} key={note.id}>
              <h3>{note.title}</h3>
              <p>{note.description}</p>
              <button onClick={() => editNote(note)}>Editar</button>
              <button onClick={() => deleteNote(note.id)}>Eliminar</button>
            </div>
          ))
        }
        
      </div>
    </div>
  )
}

export default App
