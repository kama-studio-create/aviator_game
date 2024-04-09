import {css} from '@emotion/react';
import {DARK_GRAY_COLOR, LIGHT_GRAY_COLOR, SUCCESS_COLOR} from "../../styles/colors.ts";

const switchLabelCss = css({
		display: 'flex',
		alignItems: 'center',
		cursor: 'pointer'
	})
;

const switchInputCss = css({
	width: '40px',
	height: '24px',
	appearance: 'none',
	borderRadius: '26px',
	backgroundColor: DARK_GRAY_COLOR,
	border: `1px solid ${LIGHT_GRAY_COLOR}`,
	position: 'relative',
	'&:before': {
		content: '""',
		position: 'absolute',
		top: '3px',
		left: '4px',
		width: '16px',
		height: '16px',
		borderRadius: '50%',
		backgroundColor: 'white',
		transition: '0.3s',
	},
	'&:checked': {
		backgroundColor: SUCCESS_COLOR,
		'&:before': {
			transform: 'translateX(16px)',
		},
	},
});


interface SwitchProps {
	checked: boolean;
	onChange: (checked: boolean) => void;
}

const Switch: React.FC<SwitchProps> = ({checked, onChange}) => {
	const handleChange = () => {
		onChange(!checked);
	};

	return (
		<label css={switchLabelCss}>
			<input
				type="checkbox"
				checked={checked}
				onChange={handleChange}
				css={switchInputCss}
			/>
		</label>
	);
};


export default Switch;