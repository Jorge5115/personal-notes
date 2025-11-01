package com.example.notes.controller;

import com.example.notes.model.Note;
import com.example.notes.repository.NoteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/notes")
@CrossOrigin(origins = "http://localhost:5173") // Para conectar el frontend React
public class NoteController {

    @Autowired NoteRepository noterepository;

    // Obtener las notas
    @GetMapping
    public List<Note> getAllNotes() {
        return noterepository.findAll();
    }

    // Crear una nueva nota
    @PostMapping
    public Note createNote(@RequestBody Note note) {
        return noterepository.save(note);
    }

    // Editar nota
    @PutMapping("/{id}")
    public Note updateNote(@PathVariable Long id, @RequestBody Note noteDetails) {
        Optional<Note> optionalNote = noterepository.findById(id);

        if (optionalNote.isPresent()) {
            Note note = optionalNote.get();
            note.setTitle(noteDetails.getTitle());
            note.setDescription(noteDetails.getDescription());

            return noterepository.save(note);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public String deleteNote(@PathVariable Long id) {
        Optional<Note> optionalNote = noterepository.findById(id);

        if (optionalNote.isPresent()) {
            noterepository.delete(optionalNote.get());
            return "Nota elimminada";
        }
        return null;
    }

}
