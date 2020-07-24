import React, {useState, useEffect} from 'react';
import styles from "./MessageFooter.css"
// import {useInterval, useEffectOnce} from "react-use"

const TimeIndicator = props => {

    const [deltaTime, setDeltaTime] = useState(0)

    useEffect(() => {
        setDeltaTime((new Date().getTime() - props.time) / 1000)
    }, [])
    
    useEffect(() => {
        const interval = setInterval(() => setDeltaTime((new Date().getTime() - props.time) / 1000), 5000)
        return () => clearInterval(interval)
    }, [])

    return (
        <div className={styles["time-indicator"]}>
            {deltaTime < 10 ? "Just Now" :
             deltaTime < 60 ? `${Math.floor(deltaTime)} second${Math.floor(deltaTime) > 1 ? "s" : ""} ago` : 
             deltaTime < 3600 ? `${Math.floor(deltaTime / 60)} minute${Math.floor(deltaTime/60) > 1 ? "s" : ""} ago` : 
             deltaTime < 3600 * 12 ? `${Math.floor(deltaTime / 3600)} hour${Math.floor(deltaTime/3600) > 1 ? "s" : ""} ago` :
             deltaTime < 3600 * 12 * 7 ? `${Math.floor(deltaTime / (3600*12))} day${Math.floor(deltaTime / (3600*12)) > 1 ? "s" : ""} ago` : "A Long Time Ago"}
            
        </div>
    );
}

export default TimeIndicator;
