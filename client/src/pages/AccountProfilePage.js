import React, { useState } from 'react';
import Card from '../components/Card';
import Button from '../components/Button';
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
		};
		return (
		<div className={styles.profileContainer}>
			<Card className={styles.profileCard} style={{ maxWidth: 520, margin: '40px auto', padding: 32 }}>
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
			</Card>
		</div>
	);
};

export default AccountProfilePage;
