import React, { useState, useEffect, useCallback } from "react"
import { CSSTransition } from "react-transition-group"
import MessageHeader from "./MessageHeader"
import MessageBody from "./MessageBody"
import MessageFooter from "./MessageFooter"
import styles from "./Message.css"
import badWords from "bad-words"
import Transition from "./MessageTransition.css"

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

	return  (
		<CSSTransition
			in={mounted}
			timeout={{
				enter: 100,
				exit: 500
			}}
			key={props.msg.id}
			classNames={!props.streamerInfo.CompactMessages && { ...Transition }}
			mountOnEnter
			unmountOnExit>
			{() => (
				<div
					ref={props.forwardRef}
					data-idx={props.index}
					style={style}
					className={`${showSource && styles["showing-source"]} ${
						styles["message"]
					} ${props.streamerInfo.CompactMessages && styles["Compact-message"]} ${styles[props.msg.messageId]} ${
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
					{!props.streamerInfo.CompactMessages && <MessageFooter
						isOverlay={!!props.isOverlay}
						showSource={showSource}
						setShowSource={setShowSource}
						streamerInfo={streamerInfo}
						{...props.msg}
					/>}
				</div>
			)}
		</CSSTransition>
	) 
}

export default Message
