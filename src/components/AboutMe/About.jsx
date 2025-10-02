'use client'

import React from 'react'
import styles from './About.module.css'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

const About = () => {

    const router = useRouter();

    const handleButtonPress =(path) => {
        router.push(path);
};

    return (
        <div className={styles.mySection}>
            <div className={styles.mySectionContent}>
                <div className={styles.name}>
                    <span className={styles.nameText}>Энгельгардт Кирилл</span>
                </div>
                <div className={styles.about}>
                    <span className={styles.aboutText}>Студент ГУАП, группа 4433, увлекаюсь современными технологиями и разработкой. Стремлюсь создавать проекты, которые решают реальные задачи и находят отклик у людей.</span>
                </div>
                <div>
                    <div className={styles.button} onClick={() => handleButtonPress('/uniworks')}>
                        <span>Let`s get started</span>
                    </div>
                </div>
            </div>
            <div className={styles.photo}>
                <Image
                    src='/photos/mainPhotoEng.jpg'
                    alt="Энгельгардт Кирилл"
                    width={350}
                    height={350}
                    loading='eager'
                    className={styles.photoImage}
                    priority
                />
            </div>
        </div>
    )
}

export default About