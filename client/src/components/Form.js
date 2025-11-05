import React from 'react';

const Form = ({ children, onSubmit }) => (
	<form onSubmit={onSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
		{children}
	</form>
);

export default Form;