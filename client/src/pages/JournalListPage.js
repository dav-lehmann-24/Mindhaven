import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Card from '../components/Card';
import Button from '../components/Button';
import styles from './JournalListPage.module.css';
import parser from 'html-react-parser';

const JournalListPage = () => {
  const [journals, setJournals] = useState([]);
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
      })
      .catch(() => {
        setJournals([]);
      });
  }, []);
  const [selectedJournal, setSelectedJournal] = useState(null);
  const [deleteJournal, setDeleteJournal] = useState(null);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [editSuccess, setEditSuccess] = useState(false);
  const [editJournal, setEditJournal] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editTags, setEditTags] = useState([]);
  const [editTagInput, setEditTagInput] = useState('');

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
  };
  const handleCancelEdit = () => {
    setEditJournal(null);
    setEditTitle('');
    setEditContent('');
    setEditTags([]);
    setEditTagInput('');
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
      setEditTagInput('');
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
    if (editTagInput.trim() && !editTags.includes(editTagInput.trim())) {
      setEditTags(prev => [...prev, editTagInput.trim()]);
      setEditTagInput('');
    }
  };
  const handleRemoveEditTag = tag => {
    setEditTags(prev => prev.filter(t => t !== tag));
  };

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
      <div className={styles.listWrapper}>
        {journals.length === 0 ? (
          <div className={styles.empty}>No journals found.</div>
        ) : (
          journals.map(journal => (
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
              <label className={styles.label}>Tags</label>
              <div className={styles.tagsRow}>
                <input
                  type="text"
                  value={editTagInput}
                  onChange={e => setEditTagInput(e.target.value)}
                  className={styles.input}
                  placeholder="Add tag..."
                />
                <Button type="button" text="Add" className={styles.addTagBtn} onClick={handleAddEditTag} />
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
