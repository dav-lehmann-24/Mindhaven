import React from 'react';

const Button = ({ text, ...props }) => (
	<button {...props}>
		{text}
	</button>
);

export default Button;