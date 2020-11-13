import React, { useEffect, useState } from "react";
import Avatar from "@material-ui/core/Avatar";
import Tooltip from "@material-ui/core/Tooltip";
import styles from "./MessageHeader.css";
import MenuIcon from "@material-ui/icons/Menu";
import { ContextMenu, MenuItem, ContextMenuTrigger } from "react-contextmenu";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import BlockIcon from "@material-ui/icons/Block";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import CancelTwoToneIcon from "@material-ui/icons/CancelTwoTone";

const ButtonIcon = React.memo(({ letter }) => {
	return (
		<svg xmlns="http://www.w3.org/2000/svg" version="1.1" class="MuiSvgIcon-root" viewBox="0 0 16 16">
			<g xmlns="http://www.w3.org/2000/svg" transform="translate(8, 8)">
				<circle cx="0" cy="0" r="6.25" stroke="currentColor" stroke-width="1.5" fill="currentColor" fill-opacity=".25"></circle>
				<text x="3" y="12" fill="currentColor" font-family="Montserrat" font-size="8px" stroke-width=".1697">
					<tspan x="-2.35" y="2.5" fill="currentColor">
						{letter}
					</tspan>
				</text>
			</g>
		</svg>
	);
});

const PinIcon = React.memo(({ pinned }) => {
	return pinned ? (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
			<path opacity=".3" d="M14 4h-4v5c0 1.1-.35 2.14-1 3h6c-.63-.84-1-1.88-1-3V4z" fill="green" />
			<path
				d="M19 12c-1.66 0-3-1.34-3-3V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1l1-1v-7H19v-2zM9 12c.65-.86 1-1.9 1-3V4h4v5c0 1.12.37 2.16 1 3H9z"
				fill="green"
			/>
		</svg>
	) : (
		<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" preserveAspectRatio="xMidYMid meet" viewBox="0 0 24 24">
			<path opacity=".3" d="M9.644 12.184L11.461 14H8v-.172l1.644-1.644zM13 4v6.46l-.73-.73L11 8.46V4h2z" fill="red" />
			<path
				d="M9 9l1.914 1.914L8 13.828V14h6l2 2h-3v4l-1 3l-1-3v-4H6v-3l3-3V9zm8-7v2l-2 1v5l3 3v2.461l-5-5.001V4h-2v4.46l-2-2V5L7 4V2h10z"
				fill="red"
			/>
			<path d="M2.27 2.27L1 3.54L20.46 23l1.27-1.27L11 11z" fill="red" />
		</svg>
	);
});

const discordLogo = "https://i.imgur.com/ZOKp8LH.png";
const twitchLogo =
	"https://cdn.vox-cdn.com/thumbor/hSP3rKWFHC7hbbtpCp_DIKiRSDI=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/2937002/twitch.0.jpg";

const MessageHeader = React.memo(
	({
		moddable,
		pinned,
		userColor,
		streamerInfo,
		platform,
		avatar,
		badges,
		displayName,
		isOverlay,
		deleteMe,
		pin,
		banUser,
		timeoutUser,
		NameColor,
		id,
		streamer,
		ban,
		timeout,
	}) => {
		const [showContexts, setShowContexts] = useState(false);

		useEffect(() => {
			setTimeout(() => {
				setShowContexts(!isOverlay);
			}, 300);
		}, []);

		return (
			<div className={`${styles["msg-header"]} ${streamerInfo.CompactMessages && styles["Compact-header-full"]} ${styles.name}`}>
				<span className={styles.name}>
					<div
						className={`${styles.profile} ${streamerInfo.CompactMessages && styles["Compact-header"]} ${
							styles[`${platform}-${streamerInfo.DisplayPlatformColors}`]
						}`}
					>
						{showContexts &&
							streamerInfo.CompactMessages &&
							(streamerInfo.ShowModOptions ? (
								<React.Fragment>
									<ContextMenuTrigger id={id}>
										<MenuIcon />
									</ContextMenuTrigger>
									<ContextMenu id={id}>
										{streamerInfo.ShowModOptions && (
											<React.Fragment>
												<MenuItem onClick={deleteMe}>Remove Message</MenuItem>
												{moddable && (
													<React.Fragment>
														<MenuItem onClick={timeoutUser}>Timeout User</MenuItem>
														<MenuItem onClick={banUser}>Ban User</MenuItem>
													</React.Fragment>
												)}
											</React.Fragment>
										)}
										<MenuItem onClick={pin}>{pinned ? "Unpin" : "Pin"} Message</MenuItem>
									</ContextMenu>
								</React.Fragment>
							) : (
								<React.Fragment>
									<span onClick={pin}>
										<PinIcon pinned={pinned} />
									</span>
									<span onClick={deleteMe}>
										<CancelTwoToneIcon />
									</span>
								</React.Fragment>
							))}

						{!streamerInfo.CompactMessages && <Avatar className={styles["profile-pic"]} src={avatar} alt="" />}

						{!streamerInfo.CompactMessages && badges.subscriber && (
							<Tooltip arrow title={badges.subscriber.title} placement="top">
								<img className={styles["sub-badge"]} src={badges.subscriber.image} alt=""></img>
							</Tooltip>
						)}
						{!streamerInfo.CompactMessages && badges.founder && (
							<Tooltip arrow title={badges.founder.title} placement="top">
								<img className={styles["sub-badge"]} src={badges.founder.image} alt=""></img>
							</Tooltip>
						)}
						{Object.entries(badges).map((badge, i) => {
							return streamerInfo.CompactMessages || !["subscriber", "founder"].includes(badge[0]) ? (
								<Tooltip arrow title={badge[1].title} placement="top">
									<img src={badge[1].image} alt="" className={`${styles["chat-badge"]} ${styles[`badge-${i}`]}`}></img>
								</Tooltip>
							) : (
								<React.Fragment></React.Fragment>
							);
						})}
						{streamerInfo.DisplayPlatformIcons && (
							<Tooltip title={platform} placement="top" arrow>
								<img
									width="20"
									src={platform === "discord" ? discordLogo : twitchLogo}
									alt="platform"
									className={`${styles["chat-badge"]} ${styles[platform]}`}
								/>
							</Tooltip>
						)}
					</div>
					{showContexts ? (
						<React.Fragment>
							<ContextMenuTrigger id={`${id}-username`}>
								<span
									style={{
										color: streamerInfo.ShowNameColors ? NameColor : "",
										cursor: "pointer",
									}}
									className={styles["user-name"]}
								>
									{displayName}
								</span>
							</ContextMenuTrigger>
							<ContextMenu id={`${id}-username`}>
								<div className="viewer-context">
									<div className="viewer-header">
										<div className="viewer-info">
											<img src={avatar} alt="" />
											{displayName}
										</div>
										<div className="viewer-icon">
											<a href={`https://www.twitch.tv/popout/${streamer}/viewercard/${displayName?.toLowerCase?.()}?popout=`}>
												<ExitToAppIcon />
											</a>
										</div>
									</div>
									<div className="viewer-body">
										{moddable && (
											<div className="mod-icons">
												<div onClick={() => ban(displayName?.toLowerCase?.(), platform)} data-title={`Ban ${displayName}`}>
													<BlockIcon />
												</div>
												<div onClick={timeoutUser} data-title={`Timeout ${displayName}`}>
													<AccessTimeIcon />
												</div>
												<div onClick={() => timeout(displayName?.toLowerCase?.(), platform, 1)} data-title={`Purge User`}>
													1s
												</div>
												<div
													onClick={() => timeout(displayName?.toLowerCase?.(), platform, 600)}
													data-title={`Timeout 10min`}
												>
													10m
												</div>
												<div onClick={() => timeout(displayName?.toLowerCase?.(), platform, 3600)} data-title={`Timeout 1hr`}>
													1h
												</div>
												<div
													onClick={() => timeout(displayName?.toLowerCase?.(), platform, 28800)}
													data-title={`Timeout 8hr`}
												>
													8h
												</div>
												<div
													onClick={() => timeout(displayName?.toLowerCase?.(), platform, 86400)}
													data-title={`Timeout 24hr`}
												>
													24h
												</div>
											</div>
										)}
									</div>
								</div>
							</ContextMenu>
						</React.Fragment>
					) : (
						<span
							style={{
								color: streamerInfo.ShowNameColors ? NameColor : "",
								cursor: "pointer",
							}}
							className={styles["user-name"]}
						>
							{displayName}
						</span>
					)}
				</span>
				<span
					className={styles["menu-buttons"]}
					style={
						!streamerInfo.CompactMessages
							? {
									position: "relative",
									top: "-8px",
									left: "-5px",
							  }
							: {}
					}
				>
					{" "}
					{showContexts &&
						!streamerInfo.CompactMessages &&
						(streamerInfo.ShowModOptions ? (
							<React.Fragment>
								<ContextMenuTrigger id={id}>
									<MenuIcon />
								</ContextMenuTrigger>
								<ContextMenu id={id}>
									<MenuItem onClick={deleteMe}>Remove Message</MenuItem>
									{moddable && (
										<React.Fragment>
											<MenuItem onClick={timeoutUser}>Timeout User</MenuItem>
											<MenuItem onClick={banUser}>Ban User</MenuItem>
										</React.Fragment>
									)}
									<MenuItem onClick={pin}>{pinned ? "Unpin" : "Pin"} Message</MenuItem>
								</ContextMenu>
							</React.Fragment>
						) : (
							<React.Fragment>
								<span onClick={pin}>
									<PinIcon pinned={pinned} />
								</span>
								<span onClick={deleteMe}>
									<CancelTwoToneIcon />
								</span>
							</React.Fragment>
						))}
				</span>
			</div>
		);
	}
);

export default MessageHeader;
