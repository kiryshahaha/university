import React from 'react'
import styles from './page.module.css'
import Image from 'next/image'

import Navigation from '@/components/navigation/Navigation'
import About from '@/components/AboutMe/About'
import Footer from '@/components/Footer/Footer'

export default function Home() {
    return (
        <>
            <div className={styles.container}>
                
                <Navigation />

                <About />

                <Footer />

            </div>
        </>
    )
}
