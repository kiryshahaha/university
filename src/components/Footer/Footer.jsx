import React from 'react'
import styles from './Footer.module.css'
import Image from 'next/image'

const Footer = () => {
    return (
        <div className={styles.footer}>
            <div className={styles.footerTextContainer}>
                <span className={styles.footerText}>Стэк</span>
            </div>
            <div className={styles.footerIcons}>
                <div className={styles.footerIcon}>
                    <Image src='/Logos/React-icon.svg' width={42} height={42} alt='react icon' />
                    <span className={styles.footerIconText}>ReactNative</span>
                </div>
                <div className={styles.footerIcon}>
                    <Image src='/Logos/Expo-icon.svg' width={42} height={42} alt='react icon' />
                    <span className={styles.footerIconText}>Expo</span>
                </div>
                <div className={styles.footerIcon}>
                    <Image src='/Logos/Js-icon.svg' width={42} height={42} alt='js icon' />
                    <span className={styles.footerIconText}>JavaScript</span>
                </div>
                <div className={styles.footerIcon}>
                    <Image src='/Logos/Nextjs-icon.svg' width={42} height={42} alt='nextjs icon' />
                    <span className={styles.footerIconText}>NextJS</span>
                </div>
                <div className={styles.footerIcon}>
                    <Image src='/Logos/Node-icon.svg' width={42} height={42} alt='node icon' />
                    <span className={styles.footerIconText}>NodeJS</span>
                </div>
                <div className={styles.footerIcon}>
                    <Image src='/Logos/React-icon.svg' width={42} height={42} alt='react icon' />
                    <span className={styles.footerIconText}>ReactJS</span>
                </div>
            </div>
        </div>
    )
}

export default Footer