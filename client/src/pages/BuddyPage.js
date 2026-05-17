import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './BuddyPage.module.css';
import StatusBanner from '../components/buddy/StatusBanner';
import BuddySidebar from '../components/buddy/BuddySidebar';
import ConnectBuddySection from '../components/buddy/ConnectBuddySection';
import BuddyDetailsSection from '../components/buddy/BuddyDetailsSection';
import PendingRequestsSection from '../components/buddy/PendingRequestsSection';
import BuddyChecklistSection from '../components/buddy/BuddyChecklistSection';

const buildAuthConfig = (token) => ({
  headers: { Authorization: `Bearer ${token}` },
});

const getBuddyId = (buddy) => buddy.profile_id;

const BuddyPage = () => {
  const navigate = useNavigate();
  const [buddies, setBuddies] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [selectedBuddyId, setSelectedBuddyId] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [connectBuddyUsername, setConnectBuddyUsername] = useState('');
  const [taskTitle, setTaskTitle] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState({
    buddies: false,
    pending: false,
    tasks: false,
    action: false,
  });

  const token = localStorage.getItem('token');

  const clearMessages = useCallback(() => {
    setStatusMessage('');
    setErrorMessage('');
  }, []);

  const fetchBuddies = useCallback(async () => {
    setLoading((prev) => ({ ...prev, buddies: true }));
    try {
      const res = await axios.get('/api/buddies', buildAuthConfig(token));
      setBuddies(Array.isArray(res.data) ? res.data : []);
    } catch {
      setBuddies([]);
    } finally {
      setLoading((prev) => ({ ...prev, buddies: false }));
    }
  }, [token]);

  const fetchPending = useCallback(async () => {
    setLoading((prev) => ({ ...prev, pending: true }));
    try {
      const res = await axios.get('/api/buddies/pending', buildAuthConfig(token));
      setPendingRequests(Array.isArray(res.data) ? res.data : []);
    } catch {
      setPendingRequests([]);
    } finally {
      setLoading((prev) => ({ ...prev, pending: false }));
    }
  }, [token]);

  const fetchTasks = useCallback(async (buddyId) => {
    if (!buddyId) {
      setTasks([]);
      return;
    }
    setLoading((prev) => ({ ...prev, tasks: true }));
    try {
      const res = await axios.get(`/api/buddies/tasks/${buddyId}`, buildAuthConfig(token));
      setTasks(Array.isArray(res.data) ? res.data : []);
    } catch {
      setTasks([]);
    } finally {
      setLoading((prev) => ({ ...prev, tasks: false }));
    }
  }, [token]);

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchBuddies();
    fetchPending();
  }, [navigate, token, fetchBuddies, fetchPending]);

  useEffect(() => {
    if (!selectedBuddyId && buddies.length > 0) {
      setSelectedBuddyId(getBuddyId(buddies[0]));
    }
  }, [buddies, selectedBuddyId]);

  useEffect(() => {
    fetchTasks(selectedBuddyId);
  }, [selectedBuddyId, fetchTasks]);

  const selectedBuddy = useMemo(
    () => buddies.find((buddy) => getBuddyId(buddy) === selectedBuddyId),
    [buddies, selectedBuddyId]
  );
  const incomingRequests = useMemo(
    () => pendingRequests.filter((request) => request.direction === 'incoming'),
    [pendingRequests]
  );
  const outgoingRequests = useMemo(
    () => pendingRequests.filter((request) => request.direction === 'outgoing'),
    [pendingRequests]
  );

  const handleConnectBuddy = useCallback(async (event) => {
    event.preventDefault();
    clearMessages();

    const username = connectBuddyUsername.trim();
    if (!username) {
      setErrorMessage('Please enter a username.');
      return;
    }

    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const res = await axios.post('/api/buddies', { username }, buildAuthConfig(token));
      setStatusMessage(res.data?.message || 'Buddy request sent.');
      setConnectBuddyUsername('');
      await fetchPending();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not send buddy request.');
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  }, [clearMessages, connectBuddyUsername, fetchPending, token]);

  const handleAcceptRequest = useCallback(async (buddyId) => {
    clearMessages();
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const res = await axios.put(`/api/buddies/${buddyId}/accept`, {}, buildAuthConfig(token));
      setStatusMessage(res.data?.message || 'Buddy request accepted.');
      await fetchPending();
      await fetchBuddies();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not accept request.');
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  }, [clearMessages, fetchBuddies, fetchPending, token]);

  const handleRejectRequest = useCallback(async (buddyId) => {
    clearMessages();
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const res = await axios.delete(`/api/buddies/${buddyId}/reject`, buildAuthConfig(token));
      setStatusMessage(res.data?.message || 'Buddy request rejected.');
      await fetchPending();
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not reject request.');
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  }, [clearMessages, fetchPending, token]);

  const handleRemoveBuddy = useCallback(async (buddyId) => {
    clearMessages();
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const res = await axios.delete(`/api/buddies/${buddyId}`, buildAuthConfig(token));
      setStatusMessage(res.data?.message || 'Buddy removed.');
      await fetchBuddies();
      if (selectedBuddyId === buddyId) {
        setSelectedBuddyId(null);
        setTasks([]);
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not remove buddy.');
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  }, [clearMessages, fetchBuddies, selectedBuddyId, token]);

  const handleAddTask = useCallback(async (event) => {
    event.preventDefault();
    clearMessages();

    if (!selectedBuddyId) {
      setErrorMessage('Select a buddy before adding tasks.');
      return;
    }

    const title = taskTitle.trim();
    if (!title) {
      setErrorMessage('Task title is required.');
      return;
    }

    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const res = await axios.post(
        `/api/buddies/tasks/${selectedBuddyId}`,
        { title },
        buildAuthConfig(token)
      );
      if (res.data?.task) {
        setTasks((prev) => [...prev, res.data.task]);
      } else {
        await fetchTasks(selectedBuddyId);
      }
      setTaskTitle('');
      setStatusMessage(res.data?.message || 'Checklist task created.');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not create task.');
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  }, [clearMessages, fetchTasks, selectedBuddyId, taskTitle, token]);

  const handleToggleTask = useCallback(async (task) => {
    clearMessages();
    setLoading((prev) => ({ ...prev, action: true }));
    try {
      const res = await axios.patch(
        `/api/buddies/tasks/${selectedBuddyId}/${task.id}`,
        { completed: !task.completed_by_me },
        buildAuthConfig(token)
      );
      if (Array.isArray(res.data?.tasks)) {
        setTasks(res.data.tasks);
      }
      if (res.data?.streakAwarded) {
        setStatusMessage('Nice! You both completed your tasks today. Streak awarded.');
      } else {
        setStatusMessage(res.data?.message || 'Task updated.');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Could not update task.');
    } finally {
      setLoading((prev) => ({ ...prev, action: false }));
    }
  }, [clearMessages, selectedBuddyId, token]);

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <div>
          <h1>Buddy Hub</h1>
          <p>Connect with teammates and keep each other on track.</p>
        </div>
        <div className={styles.heroMeta}>
          <span>{buddies.length} buddies</span>
          <span>{incomingRequests.length} incoming</span>
        </div>
      </div>

      <div className={styles.layout}>
        <BuddySidebar
          buddies={buddies}
          selectedBuddyId={selectedBuddyId}
          onSelectBuddy={setSelectedBuddyId}
          loadingBuddies={loading.buddies}
          pendingTotal={incomingRequests.length + outgoingRequests.length}
        />

        <main className={styles.main}>
          <StatusBanner statusMessage={statusMessage} errorMessage={errorMessage} />

          <ConnectBuddySection
            connectBuddyUsername={connectBuddyUsername}
            onChange={(event) => setConnectBuddyUsername(event.target.value)}
            onSubmit={handleConnectBuddy}
            loadingAction={loading.action}
          />

          <BuddyDetailsSection
            selectedBuddy={selectedBuddy}
            onRemoveBuddy={() => handleRemoveBuddy(getBuddyId(selectedBuddy))}
            loadingAction={loading.action}
          />

          <PendingRequestsSection
            loadingPending={loading.pending}
            incomingRequests={incomingRequests}
            outgoingRequests={outgoingRequests}
            onAccept={handleAcceptRequest}
            onReject={handleRejectRequest}
            loadingAction={loading.action}
          />

          <BuddyChecklistSection
            selectedBuddy={selectedBuddy}
            taskTitle={taskTitle}
            onTaskTitleChange={(event) => setTaskTitle(event.target.value)}
            onAddTask={handleAddTask}
            tasks={tasks}
            loadingTasks={loading.tasks}
            loadingAction={loading.action}
            onToggleTask={handleToggleTask}
          />
        </main>
      </div>
    </div>
  );
};

export default BuddyPage;
