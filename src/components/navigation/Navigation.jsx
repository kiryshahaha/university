import React from 'react'
import Image from 'next/image'
import styles from './Navigation.module.css'

const Navigation = () => {
  return (
    <div className={styles.container}>
        <div className={styles.nav}>
            <span className={styles.navComponent}>Обо мне</span>
            <span className={styles.navComponent}>Лабораторные работы</span>
            <span className={styles.navComponent}>Проекты</span>
        </div>
        <div className={styles.navConnect}>
            <Image src='/telegram-icon.svg' width={42} height={16} alt='tg icon'/>
            <Image src='/vk-icon.svg' width={22} height={16} alt='vk icon'/>
        </div>
    </div>
  )
}

export default Navigation