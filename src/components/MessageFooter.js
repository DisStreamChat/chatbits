import React, {useState, useEffect} from 'react';
import styles from "./MessageFooter.css"
import TimeIndicator from "./TimeIndicator"
import DOMPurify from "dompurify";
import SettingsEthernetIcon from '@material-ui/icons/SettingsEthernet';
import CodeIcon from '@material-ui/icons/Code';



const MessageFooter = props => {

    const {showSource, setShowSource} = props
    const [showSourceButton, setShowSourceButton] = useState(true)
    const [isOverlay, setIsOverlay] = useState(false)

    useEffect(() => {
        setShowSourceButton(props.streamerInfo.showSourceButton)
        setIsOverlay(props.isOverlay)
    }, [props])

    return (
        <div className={styles["message-footer"]}>
            <div className={`${styles.source} ${showSource && styles["open"]}`}>
                {showSourceButton && !isOverlay &&
                    <React.Fragment>
                        <div className={styles["source-button"]} onClick={() => setShowSource(s => !s)}>{!showSource ? <SettingsEthernetIcon /> : <CodeIcon />}</div>
                        <p className={styles["source-text"]}>
                            {(DOMPurify.sanitize(props.body, {
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
                            }))}
                        </p>
                    </React.Fragment>
                }
            </div>
            <TimeIndicator time={props.sentAt} />
        </div>
    );
}

export default MessageFooter;
