import React from 'react';
import marked from "marked"
import DOMPurify from "dompurify";
import styles from "./MessageBody.css"
import badWords from "bad-words"

let renderer = new marked.Renderer();
renderer.link = function (href, title, text) {
    let link = marked.Renderer.prototype.link.apply(this, arguments);
    return link.replace("<a", "<a target='_blank'");
};

const Filter = new badWords({
    placeHolder: "⭐"
})

marked.setOptions({
    renderer: renderer
});

const MessageBody = props => {
    return (
        <pre className={styles["msg-body"]} style={{color: props.messageType === "action" ? props.userColor : ""}} dangerouslySetInnerHTML={{
            __html: (DOMPurify.sanitize(props.streamerInfo.CensorMessages ? Filter.clean(props.body) : props.body, {
                FORBID_ATTR: [
                    "style",
                    "onerror",
                    "onload",
                ],
                FORBID_TAGS: [
                    "table",
                    "script",
                    "audio",
                    "video",
                    "style",
                    "iframe",
                    "textarea",
                    "input",
                    "form",
                ],
            }))
        }}>
        </pre>
    );
}

export default MessageBody;
