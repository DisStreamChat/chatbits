import React from "react";
import styles from "./MessageBody.css";
import badWords from "bad-words";

const Filter = new badWords({
	placeHolder: "⭐",
});

const MessageBody = React.memo(({ streamerInfo, messageType, body, userColor }) => {
	return (
		<pre
			className={`${streamerInfo.CompactMessages && styles["compact-message"]} ${styles["msg-body"]}`}
			style={{ color: messageType === "action" ? userColor : "" }}
			dangerouslySetInnerHTML={{
				__html: streamerInfo.CensorMessages ? Filter.clean(body) : body,
			}}
		></pre>
	);
});

export default MessageBody;
