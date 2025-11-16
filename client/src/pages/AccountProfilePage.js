import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import Button from '../components/Button';
import AppHeader from '../components/AppHeader';
import styles from './AccountProfilePage.module.css';

const initialProfile = {
	username: 'MindUser',
	email: 'user@mindhaven.com',
	bio: 'Welcome to my Mindhaven profile!',
	country: 'Germany',
	gender: 'Other',
	createdAt: '2025-01-10',
	updatedAt: '2025-11-10',
	avatar: null,
};
const AccountProfilePage = () => {
	const [profile, setProfile] = useState(initialProfile);
	const [editing, setEditing] = useState(false);
	const [avatarPreview, setAvatarPreview] = useState(null);
	const [showSuccess, setShowSuccess] = useState(false);
	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const token = localStorage.getItem('token');
		if (!token) return;
		axios.get('/api/user/profile', {
			headers: { Authorization: `Bearer ${token}` }
		})
			.then(res => {
				if (res.data && res.data.user) {
					setProfile(prev => ({ ...prev, ...res.data.user }));
				}
			})
			.catch(() => {});
	}, []);

	const handleChange = e => {
		const { name, value } = e.target;
		setProfile(prev => ({ ...prev, [name]: value }));
	};
	const handleAvatarChange = e => {
		const file = e.target.files[0];
		if (file) {
			setProfile(prev => ({ ...prev, avatar: file }));
			setAvatarPreview(URL.createObjectURL(file));
		}
	};
	
	const handleEdit = () => setEditing(true);
	const handleCancel = () => {
		setProfile(initialProfile);
		setEditing(false);
		setAvatarPreview(null);
	};
	const handleSave = () => {
		setEditing(false);
		// TODO: Save changes to backend
		setShowSuccess(true);
		setTimeout(() => setShowSuccess(false), 2000);
	};
	return (
		<>
			<AppHeader onHome={() => navigate('/dashboard')} />
			<div className={styles.profileContainer}>
				<Card className={styles.profileCard} style={{
					maxWidth: 520,
					margin: '40px auto',
					padding: 32,
					boxShadow: '0 12px 36px rgba(79,70,229,0.28)',
					background: '#fff',
				}}>
					<div className={styles.avatarSection}>
						<div className={styles.avatarWrapper}>
							<img
								src={avatarPreview || '/default-avatar.png'}
								alt="Profile"
								className={styles.avatar}
							/>
								{editing && (
									<label className={styles.avatarUpload}>
										<input type="file" accept="image/*" style={{ display: 'none' }} onChange={handleAvatarChange} />
										Change
									</label>
								)}
							</div>
						</div>
						<div className={styles.infoSection}>
							<div className={styles.fieldRow}>
								<label className={styles.label}>Username</label>
								{editing ? (
									<input name="username" value={profile.username} onChange={handleChange} className={styles.input} />
								) : (
									<span className={styles.value}>{profile.username}</span>
								)}
							</div>
							<div className={styles.fieldRow}>
								<label className={styles.label}>Email</label>
								{editing ? (
									<input name="email" value={profile.email} onChange={handleChange} className={styles.input} />
								) : (
									<span className={styles.value}>{profile.email}</span>
								)}
							</div>
							<div className={styles.fieldRow}>
								<label className={styles.label}>Bio</label>
								{editing ? (
									<textarea name="bio" value={profile.bio} onChange={handleChange} className={styles.input} rows={2} />
								) : (
									<span className={styles.value}>{profile.bio}</span>
								)}
							</div>
							<div className={styles.fieldRow}>
								<label className={styles.label}>Country</label>
								{editing ? (
									<input name="country" value={profile.country} onChange={handleChange} className={styles.input} />
								) : (
									<span className={styles.value}>{profile.country}</span>
								)}
							</div>
							<div className={styles.fieldRow}>
								<label className={styles.label}>Gender</label>
								{editing ? (
									<select name="gender" value={profile.gender} onChange={handleChange} className={styles.input}>
										<option value="Male">Male</option>
										<option value="Female">Female</option>
										<option value="Other">Other</option>
									</select>
								) : (
									<span className={styles.value}>{profile.gender}</span>
								)}
							</div>
							<div className={styles.fieldRow}>
								<label className={styles.label}>Created At</label>
								<span className={styles.value}>{profile.createdAt}</span>
							</div>
							<div className={styles.fieldRow}>
								<label className={styles.label}>Updated At</label>
								<span className={styles.value}>{profile.updatedAt}</span>
							</div>
						</div>
						<div className={styles.buttonRow}>
							{editing ? (
								<>
									<Button text="Save" onClick={handleSave} className={styles.saveBtn} />
									<Button text="Cancel" onClick={handleCancel} className={styles.cancelBtn} />
								</>
							) : (
								<Button text="Edit Profile" onClick={handleEdit} className={styles.editBtn} />
							)}
						</div>
						{editing && (
							<div style={{ marginTop: 32, textAlign: 'center' }}>
								<Button text="Delete Account" onClick={() => setShowDeleteConfirm(true)} className={styles.cancelBtn} style={{ background: 'var(--mh-red-200)', minWidth: 180 }} />
							</div>
						)}
						{showDeleteConfirm && (
							<div style={{
								position: 'fixed',
								top: 0,
								left: 0,
								width: '100vw',
								height: '100vh',
								background: 'rgba(0,0,0,0.35)',
								zIndex: 9999,
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
							}}>
								<Card className={styles.profileCard} style={{
									maxWidth: 520,
									margin: '0 auto',
									padding: '40px 32px 32px 32px',
									textAlign: 'center',
									borderRadius: 24,
									background: 'linear-gradient(135deg, #f8fafc 0%, #eef2ff 100%)',
									boxShadow: '0 8px 32px rgba(79,70,229,0.18)',
								}}>
									<h2 style={{ color: 'var(--mh-red-200)', marginBottom: 18, fontWeight: 700, fontSize: '1.45rem', letterSpacing: '0.5px' }}>Delete Account</h2>
									<p style={{ marginBottom: 24, color: '#222', fontSize: '1.08rem' }}>Are you sure you want to delete your account? This action cannot be undone.</p>
									<div style={{ display: 'flex', gap: 18, justifyContent: 'center', marginTop: 8 }}>
										<Button text="Yes, delete my account" onClick={() => { setShowDeleteConfirm(false); alert('Account deleted (demo)'); }} className={styles.cancelBtn} style={{ minWidth: 180 }} />
										<Button text="Cancel" onClick={() => setShowDeleteConfirm(false)} className={styles.editBtn} style={{ minWidth: 120, color: '#fff' }} />
									</div>
								</Card>
							</div>
						)}
					</Card>
					{showSuccess && (
						<div className={styles.successToast}>Changes saved successfully!</div>
					)}
				</div>
			</>
	);
};

export default AccountProfilePage;
