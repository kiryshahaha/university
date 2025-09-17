import React from 'react'
import styles from './page.module.css'
import About from '@/components/AboutMe/About'
import Footer from '@/components/Footer/Footer'

export default function Home() {
    return (
        <div className={styles.container}>
            <div className={styles.aboutContainer}>
                <About />
            </div>
            <Footer />
        </div>
    )
}