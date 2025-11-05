import React from 'react';

const InputField = ({
	id,
	label,
	type = 'text',
	value,
	onChange,
	placeholder,
	containerClassName,
	labelClassName,
	inputClassName,
	required,
	autoComplete,
}) => (
	<div className={containerClassName}>
		{label && (
			<label htmlFor={id} className={labelClassName}>
				{label}
			</label>
		)}
		<input
			id={id}
			type={type}
			value={value}
			onChange={onChange}
			placeholder={placeholder}
			className={inputClassName}
			required={required}
			autoComplete={autoComplete}
		/>
	</div>
);

export default InputField;