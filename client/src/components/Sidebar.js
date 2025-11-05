import React from 'react';

const Sidebar = ({ children }) => (
	<aside style={{ width: '200px', background: '#f0f0f0', padding: '16px', minHeight: '100vh' }}>
		{children}
	</aside>
);

export default Sidebar;