import React, { useCallback } from "react";
import Avatar from "@material-ui/core/Avatar";
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone";
import Tooltip from "@material-ui/core/Tooltip";
import styles from "./MessageHeader.css";

function ButtonIcon(props) {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="MuiSvgIcon-root" viewBox="0 0 16 16">
			<g xmlns="http://www.w3.org/2000/svg" transform="translate(8, 8)">
				<circle cx="0" cy="0" r="6.25" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".25"></circle>
				<text x="3" y="12" fill="currentColor" font-family="Montserrat" font-size="8px" stroke-width=".1697">
					<tspan x="-2.35" y="2.5" fill="currentColor">
						{props.letter}
					</tspan>
				</text>
			</g>
		</svg>
	);
}

function PinIcon({ pinned }) {
	return !pinned ? (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
			<path opacity=".3" d="M14 4h-4v5c0 1.1-.35 2.14-1 3h6c-.63-.84-1-1.88-1-3V4z" fill="currentColor" />
			<path
				d="M19 12c-1.66 0-3-1.34-3-3V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1l1-1v-7H19v-2zM9 12c.65-.86 1-1.9 1-3V4h4v5c0 1.12.37 2.16 1 3H9z"
				fill="currentColor"
			/>
		</svg>
	) : (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
			<path opacity=".3" d="M9.644 12.184L11.461 14H8v-.172l1.644-1.644zM13 4v6.46l-.73-.73L11 8.46V4h2z" fill="currentColor" />
			<path
				d="M9 9l1.914 1.914L8 13.828V14h6l2 2h-3v4l-1 3l-1-3v-4H6v-3l3-3V9zm8-7v2l-2 1v5l3 3v2.461l-5-5.001V4h-2v4.46l-2-2V5L7 4V2h10z"
				fill="currentColor"
			/>
			<path d="M2.27 2.27L1 3.54L20.46 23l1.27-1.27L11 11z" fill="currentColor" />
		</svg>
	);
}

const discordLogo = "https://i.imgur.com/ZOKp8LH.png";
const twitchLogo =
	"https://cdn.vox-cdn.com/thumbor/hSP3rKWFHC7hbbtpCp_DIKiRSDI=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/2937002/twitch.0.jpg";

const MessageHeader = props => {
	return (
		<div className={`${styles["msg-header"]} ${styles.name}`}>
			<span className={styles.name}>
				<div className={`${styles.profile} ${styles[`${props.platform}-${props.DisplayPlatformColors}`]}`}>
					{!props.streamerInfo.CompactMessages && <Avatar className={styles["profile-pic"]} src={props.avatar} alt="" />}

					{props.badges.subscriber && (
						<Tooltip arrow title={props.badges.subscriber.title} placement="top">
							<img className={styles["sub-badge"]} src={props.badges.subscriber.image} alt=""></img>
						</Tooltip>
					)}
					{props.badges.founder && (
						<Tooltip arrow title={props.badges.founder.title} placement="top">
							<img className={styles["sub-badge"]} src={props.badges.founder.image} alt=""></img>
						</Tooltip>
					)}
					{Object.entries(props.badges).map((badge, i) => {
						return !["subscriber", "founder"].includes(badge[0]) ? (
							<Tooltip arrow title={badge[1].title} placement="top">
								<img src={badge[1].image} alt="" className={`${styles["chat-badge"]} ${styles[`badge-${i}`]}`}></img>
							</Tooltip>
						) : (
							<React.Fragment></React.Fragment>
						);
					})}
				</div>
				<span
					style={{
						color: props.streamerInfo.ShowNameColors ? props.userColor : "",
					}}
				>
					{props.displayName}
				</span>
				{props.streamerInfo.DisplayPlatformIcons && (
					<Tooltip title={props.platform} placement="top" arrow>
						<img
							width="20"
							src={props.platform === "discord" ? discordLogo : twitchLogo}
							alt="platform"
							className={`${styles["chat-badge"]} ${styles[props.platform]}`}
						/>
					</Tooltip>
				)}
			</span>
			<span
				className={styles["menu-buttons"]}
				style={{
					position: "relative",
					top: "-8px",
					left: "-5px",
				}}
			>
				{!props.isOverlay && (
					<React.Fragment>
						{props.streamerInfo.ShowModOptions && (
							<React.Fragment>
								<button onClick={props.banUser} className={styles["menu-button"]}>
									<ButtonIcon letter="B" />
								</button>
								<button onClick={props.timeoutUser} className={styles["menu-button"]}>
									<ButtonIcon letter="T" />
								</button>
							</React.Fragment>
						)}

						<button className={styles["menu-button"]} onClick={props.deleteMe}>
							<HighlightOffTwoToneIcon />
						</button>
						<button className={styles["menu-button"]} onClick={props.pin}>
							<PinIcon pinned={props.pinned} />
						</button>
					</React.Fragment>
				)}
			</span>
		</div>
	);
};

export default MessageHeader;
