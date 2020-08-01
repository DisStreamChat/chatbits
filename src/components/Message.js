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

const Message = React.memo(({ban, timeout, index, msg, delete: deleteFunc, streamerInfo, isOverlay, forwardRef, pin, in: inProp}) => {
	const [color, setColor] = useState({})
	const [mounted, setMounted] = useState(false)

	useEffect(() => {
		setMounted(inProp)
	}, [inProp])

	useEffect(() => {
		const backgroundColor =
			msg.messageId === "raid"
				? streamerInfo.RaidColor
				: msg.messageId === "follow"
				? streamerInfo.FollowColor
				: msg.messageId === "subgift"
				? streamerInfo.SubGiftColor
				: msg.messageId === "subscription"
				? streamerInfo.SubscriptionColor
				: msg.messageId === "cheer"
				? streamerInfo.CheerColor
				: msg.messageId === "highlighted-message"
				? streamerInfo.HighlightedMessageColor
				: msg.platform === "twitch"
				? streamerInfo.TwitchColor
				: streamerInfo.DiscordColor
		const color =
			backgroundColor === ""
				? ""
				: brightnessByColor(backgroundColor) / 255 > 0.6
				? "black"
				: "white"
		setColor({
			backgroundColor,
			color
		})
	}, [msg, streamerInfo])

	const deleteMe = useCallback(() => {
		deleteFunc(msg.id, msg.platform)
    }, [msg])
    
    const banMe = useCallback(() => {
        ban(msg.uuid, msg.platform)
    }, [msg, ban])

    const timeoutMe = useCallback(() => {
        timeout(msg.uuid, msg.platform)
    }, [msg, timeout])

	return  (
		<CSSTransition
			in={mounted}
			timeout={{
				enter: 100,
				exit: 500
			}}
			key={msg.id}
			classNames={!streamerInfo.CompactMessages && { ...Transition }}
			mountOnEnter
			unmountOnExit>
			{() => (
				<div
					ref={forwardRef}
					data-idx={index}
					style={color}
					className={`${
						styles["message"]
					} ${streamerInfo.CompactMessages && styles["Compact-message"]} ${styles[msg.messageId]} ${
						streamerInfo.DisplayPlatformColors &&
						styles[msg.platform + "-message"]
					}`}>
					<MessageHeader
						isOverlay={!!isOverlay}
						deleteMe={deleteMe}
						pin={pin}
						banUser={banMe}
						timeoutUser={timeoutMe}
						streamerInfo={streamerInfo}
						{...msg}
					/>
					<MessageBody
						isOverlay={!!isOverlay}
						streamerInfo={streamerInfo}
						{...msg}
					/>
					{!streamerInfo.CompactMessages && <MessageFooter
						isOverlay={!!isOverlay}
						streamerInfo={streamerInfo}
						{...msg}
					/>}
				</div>
			)}
		</CSSTransition>
	) 
})

export default Message
