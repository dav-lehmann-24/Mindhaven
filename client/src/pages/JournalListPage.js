import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './JournalListPage.module.css';
import FilterSearch from '../components/FilterSearch';
import parser from 'html-react-parser';

const JournalListPage = () => {
  const [journals, setJournals] = useState([]);
  const [filteredJournals, setFilteredJournals] = useState([]);
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.get('/api/journal/user', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => {
        const mappedJournals = (res.data.journals || []).map(journal => ({
          ...journal,
          createdAt: journal.created_at,
          updatedAt: journal.updated_at || journal.created_at
        }));
        setJournals(mappedJournals);
        setFilteredJournals(mappedJournals);
      })
      .catch(() => {
        setJournals([]);
        setFilteredJournals([]);
      });
  }, []);

    const handleFilterApply = ({ search, filterBy, sortBy }) => {
      let result = [...journals];
      if (search.trim()) {
        if (filterBy === 'title') {
          result = result.filter(j => j.title.toLowerCase().includes(search.trim().toLowerCase()));
        } else if (filterBy === 'tag') {
          result = result.filter(j => Array.isArray(j.tags) && j.tags.some(tag => tag.toLowerCase().includes(search.trim().toLowerCase())));
        }
      }
      if (sortBy === 'newest') {
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      } else {
        result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      }
      setFilteredJournals(result);
    };
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [deleteJournal, setDeleteJournal] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editJournal, setEditJournal] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [editMood, setEditMood] = useState('');
  const [editAvailableTags, setEditAvailableTags] = useState([]);
  const [editSelectedTag, setEditSelectedTag] = useState('');

  const handleDetails = async (journal) => {
    const token = localStorage.getItem('token');
    if (!token) return;
    try {
      const res = await axios.get(`/api/journal/${journal.id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const journalData = res.data.journal;
      setSelectedJournal({
        ...journalData,
        createdAt: journalData.created_at,
        updatedAt: journalData.updated_at || journalData.created_at
      });
    } catch (err) {
      setSelectedJournal(journal);
    }
  };
  const handleCloseDetails = () => {
    setSelectedJournal(null);
  };

  const handleDeleteClick = journal => {
    setDeleteJournal(journal);
  };
  const handleCancelDelete = () => {
    setDeleteJournal(null);
  };
  const handleConfirmDelete = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.delete(`/api/journal/delete/${deleteJournal.id}`, {
      headers: { Authorization: `Bearer ${token}` }
    }).then(() => {
      setJournals(journals.filter(j => j.id !== deleteJournal.id));
      setDeleteJournal(null);
      setDeleteSuccess(true);
      setTimeout(() => setDeleteSuccess(false), 2000);
    });
  };

  const handleEditClick = journal => {
    setEditJournal(journal);
    setEditTitle(journal.title);
    setEditContent(journal.content);
    setEditTags(journal.tags);
    setEditMood('');
    setEditAvailableTags([]);
    setEditSelectedTag('');
  };
  const handleCancelEdit = () => {
    setEditJournal(null);
    setEditTitle('');
    setEditContent('');
    setEditTags([]);
    setEditMood('');
    setEditAvailableTags([]);
    setEditSelectedTag('');
  };
  const handleSaveEdit = () => {
    const token = localStorage.getItem('token');
    if (!token) return;
    axios.put(`/api/journal/update/${editJournal.id}`,
      {
        title: editTitle,
        content: editContent,
        tags: Array.isArray(editTags) ? editTags.join(',') : ''
      },
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    ).then(() => {
      setJournals(journals.map(j =>
        j.id === editJournal.id
          ? { ...j, title: editTitle, content: editContent, tags: editTags, updatedAt: new Date().toISOString() }
          : j
      ));
      setEditJournal(null);
      setEditTitle('');
      setEditContent('');
      setEditTags([]);
      setEditMood('');
      setEditAvailableTags([]);
      setEditSelectedTag('');
      setEditSuccess(true);
      setTimeout(() => setEditSuccess(false), 2000);
    });
  };

  // TipTap Editor for content
  const editor = useEditor({
    extensions: [StarterKit],
    content: editContent,
    onUpdate: ({ editor }) => {
      setEditContent(editor.getHTML());
    },
  });

  // Update editor content when editContent changes
  useEffect(() => {
    if (editor && editContent !== editor.getHTML()) {
      editor.commands.setContent(editContent);
    }
  }, [editor, editContent]);

  const handleAddEditTag = () => {
    if (editSelectedTag && !editTags.includes(editSelectedTag)) {
      setEditTags(prev => [...prev, editSelectedTag]);
      setEditSelectedTag('');
    }
  };
  const handleRemoveEditTag = tag => {
    setEditTags(prev => prev.filter(t => t !== tag));
  };

  useEffect(() => {
    if (!editMood) {
      setEditAvailableTags([]);
      setEditSelectedTag('');
      return;
    }
    axios.get(`/api/tags?mood=${editMood}`)
      .then(res => {
        setEditAvailableTags(res.data.tags || []);
        setEditSelectedTag('');
      })
      .catch(() => setEditAvailableTags([]));
  }, [editMood]);

  const formatDate = useCallback((dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return '';
    return date.toLocaleDateString('de-DE', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }) + ', ' + date.toLocaleTimeString('de-DE', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }, []);

  return (
    <div className={styles.container}>
      <h1 className={styles.pageTitle}>Your Journals</h1>
      <FilterSearch onApply={handleFilterApply} />
      <div className={styles.listWrapper}>
        {filteredJournals.length === 0 ? (
          <div className={styles.empty}>No journals found.</div>
        ) : (
          filteredJournals.map(journal => (
            <Card key={journal.id} className={styles.journalCard}>
              <div className={styles.cardHeader}>
                <h2 className={styles.title}>{journal.title}</h2>
                <span className={styles.date}>{formatDate(journal.createdAt)}</span>
              </div>
              <div className={styles.tagsRow}>
                {journal.tags.map(tag => (
                  <span key={tag} className={styles.tag}>{tag}</span>
                ))}
              </div>
              <div className={styles.contentPreview}>
                {parser(journal.content)}
              </div>
              <div className={styles.buttonRow}>
                <Button text="Details" className={styles.detailsBtn} aria-label="View details" onClick={() => handleDetails(journal)} />
                <Button text="Edit" className={styles.editBtn} aria-label="Edit journal" onClick={() => handleEditClick(journal)} />
                <Button text="Delete" className={styles.deleteBtn} aria-label="Delete journal" onClick={() => handleDeleteClick(journal)} />
              </div>
            </Card>
          ))
        )}
      </div>
      {selectedJournal && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalCard} role="dialog" aria-modal="true">
            <button className={styles.closeBtn} onClick={handleCloseDetails} aria-label="Close details">×</button>
            <h2 className={styles.modalTitle}>{selectedJournal.title}</h2>
            <div className={styles.modalInfo}><b>Created at:</b> {formatDate(selectedJournal.createdAt)}</div>
            <div className={styles.modalInfo}><b>Last updated at:</b> {formatDate(selectedJournal.updatedAt || selectedJournal.createdAt)}</div>
            <div className={styles.modalInfo}><b>Tags:</b> {selectedJournal.tags.map(tag => <span key={tag} className={styles.tag}>{tag}</span>)}</div>
            <div className={styles.modalInfo}><b>Content:</b></div>
            <div className={styles.modalContent}>{parser(selectedJournal.content)}</div>
          </div>
        </div>
      )}
      {deleteJournal && (
        <div className={styles.modalOverlay}>
          <div className={styles.confirmModal} role="dialog" aria-modal="true">
            <h2 className={styles.confirmTitle}>Delete Journal?</h2>
            <div className={styles.confirmText}>Are you sure you want to delete <b>{deleteJournal.title}</b>? This action cannot be undone.</div>
            <div className={styles.confirmButtons}>
              <Button text="Cancel" className={styles.detailsBtn} onClick={handleCancelDelete} />
              <Button text="Delete" className={styles.deleteBtn} onClick={handleConfirmDelete} />
            </div>
          </div>
        </div>
      )}
      {editJournal && (
        <div className={styles.modalOverlay}>
          <div className={styles.editModal} role="dialog" aria-modal="true">
            <button className={styles.closeBtn} onClick={handleCancelEdit} aria-label="Cancel edit">×</button>
            <h2 className={styles.modalTitle}>Edit Journal</h2>
            <div className={styles.field}>
              <label className={styles.label}>Title</label>
              <input
                type="text"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
                className={styles.input}
                required
              />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Content</label>
              <div className={styles.tiptapWrapper}>
                {/* Toolbar */}
                <div className={styles.toolbar}>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleBold().run()} title="Bold"><b>B</b></button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleItalic().run()} title="Italic"><i>I</i></button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleUnderline().run()} title="Underline" style={{ textDecoration: 'underline' }}>U</button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleStrike().run()} title="Strike" style={{ textDecoration: 'line-through' }}>S</button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleHeading({ level: 1 }).run()} title="Heading 1">H1</button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleHeading({ level: 2 }).run()} title="Heading 2">H2</button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleBulletList().run()} title="Bullet List">• List</button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleOrderedList().run()} title="Ordered List">1. List</button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleBlockquote().run()} title="Blockquote">❝</button>
                  <button type="button" onClick={() => editor && editor.chain().focus().toggleCodeBlock().run()} title="Code">{'</>'}</button>
                </div>
                <EditorContent editor={editor} className={styles.tiptapContent} />
              </div>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Mood</label>
              <select
                className={styles.input}
                name="editMood"
                value={editMood}
                onChange={e => setEditMood(e.target.value)}
              >
                <option value="" disabled>Choose Mood...</option>
                <option value="positive">Positive</option>
                <option value="negative">Negative</option>
                <option value="neutral">Neutral</option>
              </select>
            </div>
            <div className={styles.field}>
              <label className={styles.label}>Tag</label>
              <div className={styles.tagsRow}>
                <select
                  className={styles.input}
                  name="editTag"
                  value={editSelectedTag}
                  onChange={e => setEditSelectedTag(e.target.value)}
                  disabled={!editAvailableTags.length}
                >
                  <option value="" disabled>Choose Tag...</option>
                  {editAvailableTags.map(tag => (
                    <option key={tag} value={tag}>{tag}</option>
                  ))}
                </select>
                <Button
                  type="button"
                  text="Add"
                  className={styles.createBtn}
                  onClick={handleAddEditTag}
                  disabled={!editSelectedTag}
                />
              </div>
              <div className={styles.tagsList}>
                {editTags.map(tag => (
                  <span key={tag} className={styles.tag}>
                    {tag}
                    <button type="button" className={styles.removeTagBtn} onClick={() => handleRemoveEditTag(tag)}>&times;</button>
                  </span>
                ))}
              </div>
            </div>
            <div className={styles.buttonRow}>
              <Button text="Save" className={styles.createBtn} onClick={handleSaveEdit} aria-label="Save changes" />
              <Button text="Cancel" className={styles.detailsBtn} onClick={handleCancelEdit} aria-label="Cancel edit" />
            </div>
          </div>
        </div>
      )}
      {deleteSuccess && (
        <div className={styles.successToast}>Journal deleted successfully!</div>
      )}
      {editSuccess && (
        <div className={styles.successToast} style={{background:'#22c55e'}}>Journal updated successfully!</div>
      )}
    </div>
  );
};

export default JournalListPage;
