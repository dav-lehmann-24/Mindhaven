import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';
import { useEditor, EditorContent } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Bold from '@tiptap/extension-bold';
import Italic from '@tiptap/extension-italic';
import Underline from '@tiptap/extension-underline';
import Strike from '@tiptap/extension-strike';
import Heading from '@tiptap/extension-heading';
import BulletList from '@tiptap/extension-bullet-list';
import OrderedList from '@tiptap/extension-ordered-list';
import ListItem from '@tiptap/extension-list-item';
import Blockquote from '@tiptap/extension-blockquote';
import Link from '@tiptap/extension-link';
import CodeBlock from '@tiptap/extension-code-block';
import styles from './JournalCreatePage.module.css';

const initialJournal = {
  title: '',
  content: '',
  tags: [],
};

const JournalCreatePage = () => {
  const [journal, setJournal] = useState(initialJournal);
  const [showSuccess, setShowSuccess] = useState(false);
  const [mood, setMood] = useState('');
  const [availableTags, setAvailableTags] = useState([]);
  const [selectedTag, setSelectedTag] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit,
      Bold,
      Italic,
      Underline,
      Strike,
      Heading,
      BulletList,
      OrderedList,
      ListItem,
      Blockquote,
      Link,
      CodeBlock,
    ],
    content: journal.content,
    onUpdate: ({ editor }) => {
      setJournal(prev => ({ ...prev, content: editor.getHTML() }));
    },
  });

  // Clear editor content when journal is reset
  useEffect(() => {
    if (editor && journal.content === '' && editor.getHTML() !== '<p></p>') {
      editor.commands.setContent('');
    }
  }, [editor, journal.content]);

  // Toolbar actions
  const setBold = () => editor && editor.chain().focus().toggleBold().run();
  const setItalic = () => editor && editor.chain().focus().toggleItalic().run();
  const setUnderline = () => editor && editor.chain().focus().toggleUnderline().run();
  const setStrike = () => editor && editor.chain().focus().toggleStrike().run();
  const setHeading = level => editor && editor.chain().focus().toggleHeading({ level }).run();
  const setBulletList = () => editor && editor.chain().focus().toggleBulletList().run();
  const setOrderedList = () => editor && editor.chain().focus().toggleOrderedList().run();
  const setBlockquote = () => editor && editor.chain().focus().toggleBlockquote().run();
  const setCodeBlock = () => editor && editor.chain().focus().toggleCodeBlock().run();

  const handleChange = e => {
    const { name, value } = e.target;
    setJournal(prev => ({ ...prev, [name]: value }));
  };

  const handleAddTag = () => {
    if (selectedTag && !journal.tags.includes(selectedTag)) {
      setJournal(prev => ({ ...prev, tags: [...prev.tags, selectedTag] }));
      setSelectedTag('');
    }
  };

  const handleRemoveTag = tag => {
    setJournal(prev => ({ ...prev, tags: prev.tags.filter(t => t !== tag) }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    if (!token) {
      alert('You must be logged in to create a journal.');
      return;
    }
    try {
      const payload = { ...journal, tags: journal.tags.join(',') };
      await axios.post('/api/journal/create', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowSuccess(true);
      setJournal(initialJournal);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (err) {
      alert('Error creating journal.');
    }
  };

  useEffect(() => {
    if (!mood) {
      setAvailableTags([]);
      setSelectedTag('');
      return;
    }
    axios.get(`/api/tags?mood=${mood}`)
      .then(res => {
        setAvailableTags(res.data.tags || []);
        setSelectedTag('');
      })
      .catch(() => setAvailableTags([]));
  }, [mood]);

  return (
    <div className={styles.container}>
      {showSuccess && (
        <div className={styles.successToast}>Journal created!</div>
      )}
      <h1 className={styles.pageTitle}>Create Journal</h1>
      <Card className={styles.card} style={{ border: 'none', maxWidth: 600, margin: '0 auto', padding: 32 }}>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Title</label>
            <input
              name="title"
              value={journal.title}
              onChange={handleChange}
              className={styles.input}
              placeholder="Enter journal title..."
              required
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Content</label>
            <div className={styles.tiptapWrapper}>
              {/* Toolbar */}
              <div className={styles.toolbar}>
                <button type="button" onClick={setBold} title="Bold"><b>B</b></button>
                <button type="button" onClick={setItalic} title="Italic"><i>I</i></button>
                <button type="button" onClick={setUnderline} title="Underline" style={{ textDecoration: 'underline' }}>U</button>
                <button type="button" onClick={setStrike} title="Strike" style={{ textDecoration: 'line-through' }}>S</button>
                <button type="button" onClick={() => setHeading(1)} title="Heading 1">H1</button>
                <button type="button" onClick={() => setHeading(2)} title="Heading 2">H2</button>
                <button type="button" onClick={setBulletList} title="Bullet List">• List</button>
                <button type="button" onClick={setOrderedList} title="Ordered List">1. List</button>
                <button type="button" onClick={setBlockquote} title="Blockquote">❝</button>
                <button type="button" onClick={setCodeBlock} title="Code">{'</>'}</button>
              </div>
              <EditorContent editor={editor} className={styles.tiptapContent} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>Mood</label>
            <select
              className={styles.input}
              name="mood"
              value={mood}
              onChange={e => setMood(e.target.value)}
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
                name="tag"
                value={selectedTag}
                onChange={e => setSelectedTag(e.target.value)}
                disabled={!availableTags.length}
              >
                <option value="" disabled>Choose Tag...</option>
                {availableTags.map(tag => (
                  <option key={tag} value={tag}>{tag}</option>
                ))}
              </select>
              <Button
                type="button"
                text="Add"
                className={styles.addTagBtn}
                onClick={handleAddTag}
                disabled={!selectedTag}
              />
            </div>
            <div className={styles.tagsList}>
              {journal.tags.map(tag => (
                <span key={tag} className={styles.tag}>
                  {tag}
                  <button type="button" className={styles.removeTagBtn} onClick={() => handleRemoveTag(tag)}>&times;</button>
                </span>
              ))}
            </div>
          </div>
          <div className={styles.buttonRow}>
            <Button type="submit" text="Create Journal" className={styles.createBtn} aria-label="Create Journal" />
          </div>
        </form>
      </Card>
    </div>
  );
};

export default JournalCreatePage;
