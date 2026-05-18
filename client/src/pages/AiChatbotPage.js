import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './AiChatbotPage.module.css';

const DEFAULT_DISCLAIMER =
  'This AI offers supportive guidance and is not a substitute for professional mental health care.';
const DEFAULT_CRISIS_GUIDANCE =
  'If you are in immediate danger or thinking about harming yourself, call emergency services or a crisis hotline right away.';

const AiChatbotPage = () => {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      text: 'Hi, I am here to listen. Share what you are going through and I will offer a calm check-in and a few coping ideas.',
    },
  ]);
  const [input, setInput] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [disclaimer, setDisclaimer] = useState(DEFAULT_DISCLAIMER);
  const [crisisGuidance, setCrisisGuidance] = useState(DEFAULT_CRISIS_GUIDANCE);
  const listRef = useRef(null);

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
    }
  }, [navigate, token]);


  useEffect(() => {
    if (!listRef.current) {
      return;
    }
    const node = listRef.current;
    const scrollToBottom = () => {
      node.scrollTop = node.scrollHeight;
    };
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmed = input.trim();

    if (!trimmed) {
      setError('Please enter a message before sending.');
      return;
    }

    if (!token) {
      navigate('/login');
      return;
    }

    setError('');
    setInput('');
    setIsLoading(true);
    setMessages((prev) => [...prev, { role: 'user', text: trimmed }]);

    try {
      const res = await axios.post(
        '/api/ai/support',
        { message: trimmed },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const reply = res.data?.reply || 'I am here with you. Could you share a bit more?';
      setMessages((prev) => [...prev, { role: 'assistant', text: reply }]);
      setDisclaimer(res.data?.disclaimer || DEFAULT_DISCLAIMER);
      setCrisisGuidance(res.data?.crisisGuidance || DEFAULT_CRISIS_GUIDANCE);
    } catch (err) {
      setError(err.response?.data?.message || 'We could not reach the AI right now. Please try again soon.');
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: 'Sorry, I could not respond right now. Please try again in a moment.' },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.shell}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>Mindhaven AI Support</p>
            <h1 className={styles.title}>AI Chatbot</h1>
            <p className={styles.subtitle}>
              Ask a question or share how you feel. You will get a warm, supportive reply with practical tips.
            </p>
          </div>
          <div className={styles.headerOrb} aria-hidden="true" />
        </header>

        <section className={styles.chatArea}>
          <div className={styles.messageList} aria-live="polite" ref={listRef}>
            {messages.map((message, index) => (
              <div
                key={`${message.role}-${index}`}
                className={`${styles.message} ${
                  message.role === 'user' ? styles.messageUser : styles.messageAi
                }`}
              >
                {message.text}
              </div>
            ))}
            {isLoading && <div className={`${styles.message} ${styles.messageAi}`}>Thinking...</div>}
          </div>

          <form className={styles.inputRow} onSubmit={handleSubmit}>
            <input
              className={styles.input}
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Type your message..."
              aria-label="Chatbot message"
              disabled={isLoading}
            />
            <button className={styles.sendButton} type="submit" disabled={isLoading}>
              Send
            </button>
          </form>
          {error && <div className={styles.error}>{error}</div>}
        </section>

        <section className={styles.metaSection}>
          <div className={styles.metaCard}>
            <h2>Before you continue</h2>
            <p>{disclaimer}</p>
          </div>
          <div className={styles.metaCard}>
            <h2>Immediate help</h2>
            <p>{crisisGuidance}</p>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AiChatbotPage;
