// frontend/src/components/Notes.js

import React, { useState, useEffect, useContext } from 'react';
import AuthContext from '../context/AuthContext';
import Menu from './Menu';
import NoteForm from './NoteForm';
import api from '../services/api';

const Notes = () => {
    const { auth, logout } = useContext(AuthContext);
    const [notes, setNotes] = useState([]);
    const [view, setView] = useState('all'); // Keeps track of the current view
    const [searchQuery, setSearchQuery] = useState('');
    const [currentLabel, setCurrentLabel] = useState('');

    useEffect(() => {
        const fetchNotes = async () => {
            try {
                let endpoint = '/notes';
                if (view === 'archived') {
                    endpoint = '/notes/archived';
                }
                if (view === 'trash') {
                    endpoint = '/notes/trash';
                }
                const { data } = await api.get(endpoint);
                setNotes(data);
            } catch (error) {
                console.error('Failed to fetch notes', error);
                logout();
            }
        };

        if (auth.token) {
            fetchNotes();
        }
    }, [auth.token, logout, view]);

    const handleMenuSelect = (menu) => {
        setSearchQuery('');
        setCurrentLabel('');
        setView(menu);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
    };

    const filteredNotes = notes.filter(note => {
        if (view === 'labels' && currentLabel) {
            return note.tags.includes(currentLabel);
        }
        if (searchQuery) {
            return note.title.toLowerCase().includes(searchQuery.toLowerCase()) || note.content.toLowerCase().includes(searchQuery.toLowerCase());
        }
        return true;
    });

    const handleDelete = async (id) => {
        try {
            await api.delete(`/notes/${id}`);
            setNotes(notes.filter(note => note._id !== id));
        } catch (error) {
            console.error('Failed to delete note', error);
        }
    };

    const handleArchive = async (id) => {
        try {
            const { data } = await api.put(`/notes/${id}/archive`);
            setNotes(notes.map(note => (note._id === id ? data : note)));
        } catch (error) {
            console.error('Failed to archive note', error);
        }
    };

    const handleUnarchive = async (id) => {
        try {
            await api.put(`/notes/${id}/unarchive`);
            setNotes(notes.filter(note => note._id !== id)); // Remove unarchived note from current view
        } catch (error) {
            console.error('Failed to unarchive note', error);
        }
    };

    const handleLabelSelect = (label) => {
        setCurrentLabel(label);
        setView('labels');
    };

    return (
        <div className="notes-container">
            <button onClick={logout}>Logout</button>
            <Menu onMenuSelect={handleMenuSelect} />

            {view === 'new' && <NoteForm setNotes={setNotes} />}
            {view === 'search' && (
                <div>
                    <input
                        type="text"
                        placeholder="Search notes..."
                        value={searchQuery}
                        onChange={handleSearch}
                    />
                </div>
            )}
            {view === 'labels' && (
                <div>
                    <input
                        type="text"
                        placeholder="Enter label..."
                        value={currentLabel}
                        onChange={(e) => handleLabelSelect(e.target.value)}
                    />
                </div>
            )}
            <h2>{view === 'trash' ? 'Trashed Notes' : view === 'archived' ? 'Archived Notes' : 'Your Notes'}</h2>
            <div className="notes-list">
                {filteredNotes.map(note => (
                    <div key={note._id} className="note" style={{ backgroundColor: note.color }}>
                        <h3>{note.title}</h3>
                        <p>{note.content}</p>
                        {note.reminder && <p>Reminder: {new Date(note.reminder).toLocaleString()}</p>}
                        {note.tags && <p>Tags: {note.tags.join(', ')}</p>}
                        {view === 'archived' ? (
                            <button onClick={() => handleUnarchive(note._id)}>Unarchive</button>
                        ) : view !== 'trash' ? (
                            <>
                                <button onClick={() => handleArchive(note._id)}>Archive</button>
                                <button onClick={() => handleDelete(note._id)}>Delete</button>
                            </>
                        ) : ( <p>Will be Deleted after 30 days</p> ) }
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Notes;
