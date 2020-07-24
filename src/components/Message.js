import React, { useState, useEffect, useCallback } from "react"
import { CSSTransition } from "react-transition-group"
import MessageHeader from "./MessageHeader"
import MessageBody from "./MessageBody"
import MessageFooter from "./MessageFooter"
import Tooltip from "@material-ui/core/Tooltip"
import styles from "./Message.css"
import HighlightOffTwoToneIcon from "@material-ui/icons/HighlightOffTwoTone"
import badWords from "bad-words"
import marked from "marked"
import DOMPurify from "dompurify"
import Transition from "./MessageTransition.css"

function ButtonIcon(props) {
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			version="1.1"
			class="MuiSvgIcon-root"
			viewBox="0 0 16 16">
			<g xmlns="http://www.w3.org/2000/svg" transform="translate(8, 8)">
				<circle
					cx="0"
					cy="0"
					r="6.25"
					stroke="currentColor"
					stroke-width="1.5"
					fill="currentColor"
					fill-opacity=".25"></circle>
				<text
					x="3"
					y="12"
					fill="currentColor"
					font-family="Montserrat"
					font-size="8px"
					stroke-width=".1697">
					<tspan x="-2.35" y="2.5" fill="currentColor">
						{props.letter}
					</tspan>
				</text>
			</g>
		</svg>
	)
}

function PinIcon({ pinned }) {
	return !pinned ? (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
			>
			<path
				opacity=".3"
				d="M14 4h-4v5c0 1.1-.35 2.14-1 3h6c-.63-.84-1-1.88-1-3V4z"
				fill="currentColor"
			/>
			<path
				d="M19 12c-1.66 0-3-1.34-3-3V4h1c.55 0 1-.45 1-1s-.45-1-1-1H7c-.55 0-1 .45-1 1s.45 1 1 1h1v5c0 1.66-1.34 3-3 3v2h5.97v7l1 1l1-1v-7H19v-2zM9 12c.65-.86 1-1.9 1-3V4h4v5c0 1.12.37 2.16 1 3H9z"
				fill="currentColor"
			/>
		</svg>
	) : (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			preserveAspectRatio="xMidYMid meet"
			viewBox="0 0 24 24"
			>
			<path
				opacity=".3"
				d="M9.644 12.184L11.461 14H8v-.172l1.644-1.644zM13 4v6.46l-.73-.73L11 8.46V4h2z"
				fill="currentColor"
			/>
			<path
				d="M9 9l1.914 1.914L8 13.828V14h6l2 2h-3v4l-1 3l-1-3v-4H6v-3l3-3V9zm8-7v2l-2 1v5l3 3v2.461l-5-5.001V4h-2v4.46l-2-2V5L7 4V2h10z"
				fill="currentColor"
			/>
			<path
				d="M2.27 2.27L1 3.54L20.46 23l1.27-1.27L11 11z"
				fill="currentColor"
			/>
		</svg>
	)
}

const Filter = new badWords({
	placeHolder: "⭐"
})

const discordLogo = "https://i.imgur.com/ZOKp8LH.png"
const twitchLogo =
	"https://cdn.vox-cdn.com/thumbor/hSP3rKWFHC7hbbtpCp_DIKiRSDI=/1400x1400/filters:format(jpeg)/cdn.vox-cdn.com/uploads/chorus_asset/file/2937002/twitch.0.jpg"

/**
 * Calculate brightness value by RGB or HEX color.
 * @param color (String) The color value in RGB or HEX (for example: #000000 || #000 || rgb(0,0,0) || rgba(0,0,0,0))
 * @returns (Number) The brightness value (dark) 0 ... 255 (light)
 */
function brightnessByColor(color) {
	var color = "" + color,
		isHEX = color.indexOf("#") == 0,
		isRGB = color.indexOf("rgb") == 0
	if (isHEX) {
		const hasFullSpec = color.length == 7
		var m = color.substr(1).match(hasFullSpec ? /(\S{2})/g : /(\S{1})/g)
		if (m)
			var r = parseInt(m[0] + (hasFullSpec ? "" : m[0]), 16),
				g = parseInt(m[1] + (hasFullSpec ? "" : m[1]), 16),
				b = parseInt(m[2] + (hasFullSpec ? "" : m[2]), 16)
	}
	if (isRGB) {
		var m = color.match(/(\d+){3}/g)
		if (m)
			var r = m[0],
				g = m[1],
				b = m[2]
	}
	if (typeof r != "undefined") return (r * 299 + g * 587 + b * 114) / 1000
}

const Message = (props) => {
	const { streamerInfo } = props

	const [active, setActive] = useState(true)
	const [color, setColor] = useState({})
	const [showSource, setShowSource] = useState(false)
	const [style, setStyle] = useState({})
	const [mounted, setMounted] = useState(false)
	const { in: inProp } = props

	useEffect(() => {
		setMounted(inProp)
	}, [inProp])

	useEffect(() => {
		setStyle({
			fontFamily: `${streamerInfo.Font} !important`,
			...(streamerInfo.DisplayPlatformColors || props.msg.messageId
				? color
				: {})
		})
	}, [color, streamerInfo])

	useEffect(() => {
		const backgroundColor =
			props.msg.messageId === "raid"
				? streamerInfo.RaidColor
				: props.msg.messageId === "follow"
				? streamerInfo.FollowColor
				: props.msg.messageId === "subgift"
				? streamerInfo.SubGiftColor
				: props.msg.messageId === "subscription"
				? streamerInfo.SubscriptionColor
				: props.msg.messageId === "cheer"
				? streamerInfo.CheerColor
				: props.msg.messageId === "highlighted-message"
				? streamerInfo.HighlightedMessageColor
				: props.msg.platform === "twitch"
				? streamerInfo.TwitchColor
				: streamerInfo.DiscordColor
		const color =
			backgroundColor === ""
				? ""
				: brightnessByColor(backgroundColor) / 255 > 0.5
				? "black"
				: "white"
		setColor({
			backgroundColor,
			color
		})
	}, [props, streamerInfo])

	useEffect(() => {
		setActive((a) => a && !props.msg.deleted)
	}, [props])

	const deleteMe = useCallback(() => {
		setActive(false)
		props.delete(props.msg.id, props.msg.platform)
	}, [props])

	return !streamerInfo.CompactMessages ? (
		<CSSTransition
			in={mounted}
			timeout={{
				enter: 100,
				exit: 500
			}}
			key={props.msg.id}
			classNames={{ ...Transition }}
			mountOnEnter
			unmountOnExit>
			{(state) => (
				<div
					ref={props.forwardRef}
					data-idx={props.index}
					style={style}
					className={`${showSource && styles["showing-source"]} ${
						styles["message"]
					} ${styles[props.msg.messageId]} ${
						streamerInfo.DisplayPlatformColors &&
						styles[props.msg.platform + "-message"]
					} ${!active && styles["fade-out"]}`}>
					<MessageHeader
						isOverlay={!!props.isOverlay}
						deleteMe={deleteMe}
						pin={props.pin}
						banUser={() =>
							props.ban(props.msg.uuid, props.msg.platform)
						}
						timeoutUser={() =>
							props.timeout(props.msg.uuid, props.msg.platform)
						}
						streamerInfo={streamerInfo}
						{...props.msg}
					/>
					<MessageBody
						isOverlay={!!props.isOverlay}
						streamerInfo={streamerInfo}
						{...props.msg}
					/>
					<MessageFooter
						isOverlay={!!props.isOverlay}
						showSource={showSource}
						setShowSource={setShowSource}
						streamerInfo={streamerInfo}
						{...props.msg}
					/>
				</div>
			)}
		</CSSTransition>
	) : (
		mounted && (
			<div
				ref={props.forwardRef}
				data-idx={props.index}
				style={
					streamerInfo.DisplayPlatformColors || props.msg.messageId
						? color
						: {}
				}
				className={`${styles["compact-message"]} ${
					streamerInfo.DisplayPlatformColors &&
					styles[props.msg.platform + "-message"]
				}`}>
				<div className={styles["compact-message-body"]}>
					<span className={styles["compact-message-name"]}>
						<div className={styles.profile}>
							{Object.entries(props.msg.badges).map(
								(badge, i) => {
									return (
										<Tooltip
											arrow
											title={badge[1].title}
											placement="top">
											<img
												src={badge[1].image}
												alt=""
												className={`${
													styles["chat-badge"]
												} ${
													styles[`badge-${i}`]
												}`}></img>
										</Tooltip>
									)
								}
							)}
						</div>
						{props.streamerInfo.DisplayPlatformIcons && (
							<Tooltip
								title={props.msg.platform}
								placement="top"
								arrow>
								<img
									width="20"
									src={
										props.msg.platform === "discord"
											? discordLogo
											: twitchLogo
									}
									alt="platform"
									className={`${styles["chat-badge"]} ${
										styles[props.msg.platform]
									}`}
								/>
							</Tooltip>
						)}
						<span
							className={styles["name-content"]}
							style={{
								color: props.streamerInfo.ShowNameColors
									? props.msg.userColor
									: ""
							}}>
							{props.msg.displayName}
						</span>
					</span>
					<div
						className={styles["compact-message-text"]}
						dangerouslySetInnerHTML={{
							__html: DOMPurify.sanitize(
								props.streamerInfo.CensorMessages
									? Filter.clean(props.msg.body)
									: props.msg.body,
								{
									FORBID_ATTR: ["style", "onerror", "onload"],
									FORBID_TAGS: [
										"table",
										"script",
										"audio",
										"video",
										"style",
										"iframe",
										"textarea",
										"input",
										"form"
									]
								}
							)
						}}></div>
				</div>
				{!props.isOverlay && (
					<span>
						<React.Fragment>
							{props.streamerInfo.ShowModOptions && (
								<React.Fragment>
									<button
										onClick={() =>
											props.ban(
												props.msg.uuid,
												props.msg.platform
											)
										}
										className={styles["menu-button"]}>
										<ButtonIcon letter="B" />
									</button>
									<button
										onClick={() =>
											props.timeout(
												props.msg.uuid,
												props.msg.platform
											)
										}
										className={styles["menu-button"]}>
										<ButtonIcon letter="T" />
									</button>
								</React.Fragment>
							)}

							<button
								className={styles["menu-button"]}
								onClick={deleteMe}>
								<HighlightOffTwoToneIcon />
							</button>
							<button
								className={styles["menu-button"]}
								onClick={props.pin}>
								<PinIcon pinned={props.msg.pinned} />
							</button>
						</React.Fragment>
					</span>
				)}
			</div>
		)
	)
}

export default Message
