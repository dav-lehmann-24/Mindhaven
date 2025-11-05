import React from 'react';

const Card = ({ children, className, style }) => (
	<div className={className} style={style}>
		{children}
	</div>
);

export default Card;