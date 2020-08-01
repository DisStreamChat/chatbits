import React from 'react';
import styles from "./MessageFooter.css"
import TimeIndicator from "./TimeIndicator"

const MessageFooter = React.memo(({sentAt}) => {
    return (
        <div className={styles["message-footer"]}>
            <div className={`${styles.source}`}>
                
            </div>
            <TimeIndicator time={sentAt} />
        </div>
    );
})

export default MessageFooter;
