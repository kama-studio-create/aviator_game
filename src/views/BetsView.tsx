import {css} from "@emotion/react";
import {
	BLUE_COLOR,
	COLOR_BLUE,
	DARK_GRAY_COLOR,
	ERROR_COLOR,
	GRAY_COLOR,
	LIGHT_GRAY_COLOR,
	PRIMARY_COLOR,
	SUCCESS_COLOR,
	WHITE_COLOR
} from "../styles/colors.ts";
import {FC, useEffect, useState} from "react";
import {NumberInput} from "../components/inputs/NumberInput.tsx";
import {ENDED, FACTOR, MINIMUM_BET, PLAYING, TGameState, WAITING, WAITING_FOR_NEXT_ROUND} from "../common/constants.ts";
import SwitchInput from "../components/inputs/SwitchInput.tsx";
import {AutoPlayModal} from "../components/modals/AutoPlayModal.tsx";
import {NumberInputWithButtons} from "../components/inputs/NumberInputWithButtons.tsx";

const betInputStyles = {
	row: css({
		display: 'flex',
		flexDirection: 'row',
		gap: 8,
		position: 'relative',
		alignItems: 'center'
	}),
	inputContainer: css({
		width: '100%',
		padding: 16,
		display: 'flex',
		flexDirection: 'column',
		gap: 8,
		flex: 1,
		backgroundColor: '#1b1c1d',
		borderRadius: 8
	}),
	tabContainer: css({
		display: 'flex',
		flexDirection: 'row',
		width: '60%',
		padding: 2,
		backgroundColor: '#141516',
		borderRadius: 16,
		marginInline: 'auto'
	}),
	tab: css({
		width: '100%',
		padding: 4,
		display: 'flex',
		flexDirection: 'column',
		gap: 8,
		flex: 1,
		backgroundColor: DARK_GRAY_COLOR,
		borderRadius: 16,
		textAlign: 'center',
		fontSize: 12,
		'&.active': {
			backgroundColor: GRAY_COLOR,
			border: `1px solid ${DARK_GRAY_COLOR}`,
		},
		transition: 'background-color 0.2s ease-in-out'

	}),

	smallBtn: css({
		width: 6,
		height: 6,
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		cursor: 'pointer',
		backgroundColor: 'transparent',
		fontSize: 12,
		border: 'none',
		':hover': {
			backgroundColor: '#1b1c1d',
		}
	}),

	buttonGrid: css({
		display: 'grid',
		gridTemplateColumns: 'repeat(2, 1fr)',
		gap: 4,
		marginInline: 'auto',
		width: '100%'
	}),
	selectAmountBtn: css({
		width: '100%',
		paddingBlock: 4,
		textAlign: 'center',
		backgroundColor: DARK_GRAY_COLOR,
		border: 'none',
		borderRadius: 8,
		fontSize: 12
	}),
	betButton: css({
		width: '100%',
		height: '100%',
		flex: 1,
		paddingBlock: 8,
		paddingInline: 16,
		textAlign: 'center',
		backgroundColor: SUCCESS_COLOR,
		border: '1px solid white',
		borderRadius: 16,
		fontSize: 14,
		textTransform: 'uppercase',
		display: 'flex',
		flexDirection: 'column',
		gap: 8,
		justifyContent: 'center',
		alignItems: 'center',
		transition: 'background-color 0.4s ease-in-out',
		':hover': {
			backgroundColor: WHITE_COLOR,
		}
	}),
	autoplayContainer: css({
		display: 'flex',
		flexDirection: 'row',
		gap: 4,
		alignItems: 'center',
		justifyContent: 'space-between',
		width: '100%',
		height: '100%',
		paddingTop: 16,
		borderTop: '1px solid black'
	}),
	autoplayButton: css({
		height: '100%',
		paddingBlock: 4,
		paddingInline: 8,
		textAlign: 'center',
		backgroundColor: COLOR_BLUE,
		border: 'none',
		borderRadius: 16,
		fontSize: 10,
		textTransform: 'uppercase',
		display: 'flex',
		flexDirection: 'column',
		gap: 8,
		justifyContent: 'center',
		alignItems: 'center',
		color: WHITE_COLOR,
		transition: 'background-color 0.2s ease-in-out',
		':hover': {
			backgroundColor: WHITE_COLOR,
			color: BLUE_COLOR
		}
	})
}

type InputProps = {
	gameState: TGameState,
	startTime: number,
	now: number,
	index: number
}

const quickBetOptions: { label: string, value: number }[] = [
	{label: '50', value: 50},
	{label: '100', value: 100},
	{label: '200', value: 200},
	{label: '500', value: 500}
]

export const BetsView: FC<InputProps> = ({gameState, startTime, now, index}) => {
	const [betAmount, setBetAmount] = useState(MINIMUM_BET);
	const [isPlaying, setIsPlaying] = useState(false);
	const [isWaitingForNext, setIsWaitingForNext] = useState(false);
	const [exitTime, setExitTime] = useState<number | null>(null);
	const [exitMultiplier, setExitMultiplier] = useState(1);
	const [buttonColor, setButtonColor] = useState(SUCCESS_COLOR);

	const [isAutoPlay, setAutoPlay] = useState(false);

	const [buttonTitle, setButtonTitle] = useState('BET');

	const [isAutoCheckout, setAutoCheckout] = useState(false);

	const [autoPlayMultiplierLimit, setAutoPlayMultiplierLimit] = useState(1.10);
	const [isAutoplayModalOpen, setIsAutoplayModalOpen] = useState(false);


	const getWinAmount = () => {
		if (isWaitingForNext) {
			return betAmount
		}

		if (gameState === PLAYING && isPlaying) {
			const elapsedTime = Date.now() - startTime;
			const multiplier = Math.exp(FACTOR * elapsedTime);
			return (multiplier * betAmount).toFixed(2);
		} else if (gameState === ENDED && isPlaying) {
			return (exitMultiplier * betAmount).toFixed(2);
		} else {
			return betAmount;
		}
	}


	const handleChange = (value: number) => {
		setBetAmount(value);
		setIsPlaying(false);
	}

	const getMultiplier = (endedAt: number, startedAt: number) => {
		const elapsedTime = endedAt - startedAt;
		return Math.exp(FACTOR * elapsedTime);
	}

	const handleBetButtonClick = () => {
		if (isWaitingForNext) {
			setIsWaitingForNext(false);
			setIsPlaying(false);
			return;
		}

		if (gameState === PLAYING && isPlaying) {
			setExitTime(Date.now());
			return;
		}
		if (!isPlaying) {
			if (gameState === PLAYING) {
				setIsWaitingForNext(true);
			}
			setButtonColor(ERROR_COLOR);
			setButtonTitle('CANCEL');
			setIsPlaying(true);
			return;
		}
	}
	useEffect(() => {
		if (gameState === PLAYING && isAutoCheckout && isPlaying && !isWaitingForNext) {
			const multiplier = getMultiplier(now, startTime);
			if (multiplier >= autoPlayMultiplierLimit) {
				setExitTime(now);
				setExitMultiplier(multiplier);
			}
		}
	}, [autoPlayMultiplierLimit, gameState, isAutoCheckout, isPlaying, now, startTime]);

	useEffect(() => {
		switch (gameState) {
			case WAITING:
				setIsWaitingForNext(false);
				setExitTime(null);
				setExitMultiplier(0);
				if (isPlaying) {
					setButtonTitle('CANCEL');
				}
				break;
			case PLAYING:
				if (exitTime && isPlaying) {
					const multiplier = getMultiplier(Date.now(), exitTime);
					setExitMultiplier(multiplier);
					setIsWaitingForNext(false);
					setButtonColor(SUCCESS_COLOR);
					setButtonTitle('BET');
					setIsPlaying(false);
					console.log('exit data', {index: index, exitTime: exitTime, multiplier: exitMultiplier})
				}
				if (isPlaying && !isWaitingForNext) {
					setButtonColor(PRIMARY_COLOR);
					setButtonTitle('EXIT');
				}
				if (!isPlaying && !isWaitingForNext) {
					setButtonColor(SUCCESS_COLOR);
					setButtonTitle('BET');
				}
				break;
			case ENDED:
				if (!isWaitingForNext) {
					setButtonColor(SUCCESS_COLOR);
					setButtonTitle('BET');
					setIsPlaying(false);
				}
				break;
			default:
				break;
		}
	}, [gameState, exitTime, isWaitingForNext, isPlaying, isAutoCheckout, autoPlayMultiplierLimit]);


	return (
		<div css={betInputStyles.inputContainer}>
			<AutoPlayModal isOpen={isAutoplayModalOpen} onClose={setIsAutoplayModalOpen}/>
			<div css={betInputStyles.tabContainer}>
				<div onClick={() => setAutoPlay(false)} className={!isAutoPlay ? 'active' : ''} css={betInputStyles.tab}>Bet
				</div>
				<div onClick={() => {
					setAutoPlay(true);
				}} className={isAutoPlay ? 'active' : ''} css={betInputStyles.tab}>Auto
				</div>
			</div>
			<div css={betInputStyles.row}>
				<div style={{display: 'flex', flexDirection: 'column', gap: 4, flex: 1}}>
					<div style={{display: 'flex', width: '100%'}}>
						<NumberInputWithButtons
							style={{width: '100%'}}
							disabled={false}
							onValueChange={handleChange}
							value={betAmount}
						/>
					</div>
					<div css={betInputStyles.buttonGrid}>
						{quickBetOptions.map(option => (
							<button key={option.label} onClick={() => setBetAmount(option.value)}
											css={betInputStyles.selectAmountBtn}>{option.label}</button>
						))}
					</div>
				</div>

				<div style={{
					width: '100%',
					textAlign: 'center',
					height: '100%',
					flex: 1,
					display: 'flex',
					flexDirection: 'column',
					gap: 6,
				}}>
					{/*{isWaitingForNext && <div>{WAITING_FOR_NEXT_ROUND}</div>}*/}
					<div style={{
						flexGrow: isWaitingForNext ? 1 : 0,
						height: isWaitingForNext ? 12 : 0
					}}>{WAITING_FOR_NEXT_ROUND}</div>
					<button style={{backgroundColor: buttonColor, flexGrow: 1, flex: 1}} onClick={handleBetButtonClick}
									css={betInputStyles.betButton}>
						<div>{buttonTitle}</div>
						<div>ksh. {getWinAmount()} </div>
					</button>
				</div>


			</div>
			{isAutoPlay && <div css={betInputStyles.autoplayContainer}>
				<button onClick={() => setIsAutoplayModalOpen(true)} css={betInputStyles.autoplayButton}>
					Autoplay
				</button>
				<div style={{
					display: 'flex',
					flexDirection: 'row',
					gap: 16,
					alignItems: 'center',
					color: LIGHT_GRAY_COLOR,
					fontWeight: 500
				}}>
					<div>Auto Cash Out</div>
					<SwitchInput checked={isAutoCheckout} onChange={setAutoCheckout}/>
					<NumberInput style={{maxWidth: 80}} disabled={!isAutoCheckout}
											 handleChange={(value) => {
												 setAutoPlayMultiplierLimit(value);
											 }}
											 value={autoPlayMultiplierLimit}/>
				</div>
			</div>}
		</div>
	)
}