'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Navigation.module.css'

const Navigation = () => {
  const pathname = usePathname()

  const isActive = (path) => {
    return pathname === path
  }

  return (
    <div className={styles.container}>
        <div className={styles.nav}>
            <Link href="/" className={`${styles.navComponent} ${isActive('/') ? styles.active : ''}`}>
                Обо мне
            </Link>
            <Link href="/uniworks" className={`${styles.navComponent} ${isActive('/uniworks') ? styles.active : ''}`}>
                Лабораторные работы
            </Link>
            <Link href="/projects" className={`${styles.navComponent} ${isActive('/projects') ? styles.active : ''}`}>
                Проекты
            </Link>
        </div>
        <div className={styles.navConnect}>
            <Link 
                href="https://t.me/kiryshahaha0_0" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
            >
                <Image src='/Logos/telegram-icon.svg' width={42} height={16} alt='tg icon'/>
            </Link>
            <Link 
                href="https://vk.com/id557833214" 
                target="_blank" 
                rel="noopener noreferrer"
                className={styles.socialLink}
            >
                <Image src='/Logos/vk-icon.svg' width={22} height={16} alt='vk icon'/>
            </Link>
        </div>
    </div>
  )
}

export default Navigation