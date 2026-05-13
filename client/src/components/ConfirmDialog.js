import React from 'react';
import styles from './ConfirmDialog.module.css';

const ConfirmDialog = ({
	open,
	title,
	description,
	confirmText,
	cancelText,
	onConfirm,
	onCancel,
}) => {
	if (!open) return null;

	return (
		<div className={styles.overlay} role="dialog" aria-modal="true" aria-label={title}>
			<div className={styles.card}>
				<h2 className={styles.title}>{title}</h2>
				<p className={styles.description}>{description}</p>
				<div className={styles.actions}>
					<button className={styles.cancelButton} onClick={onCancel} type="button">
						{cancelText}
					</button>
					<button className={styles.confirmButton} onClick={onConfirm} type="button">
						{confirmText}
					</button>
				</div>
			</div>
		</div>
	);
};

export default ConfirmDialog;
