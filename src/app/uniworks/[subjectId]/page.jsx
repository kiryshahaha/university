import React from 'react'
import Link from 'next/link'
import styles from './SubjectPage.module.css'

// Данные лабораторных работ для каждого предмета
const labData = {
  1: ['Лабораторная 1', 'Лабораторная 2', 'Лабораторная 3', 'Лабораторная 4', 'Лабораторная 5', 'Лабораторная 6', 'Лабораторная 7'], 
  2: ['Лабораторная 1', 'Лабораторная 2'], 
  3: ['Лабораторная 1', 'Лабораторная 2', 'Лабораторная 3', 'Лабораторная 4'] 
}

const subjectNames = {
  1: 'Алгоритмы и струтуры данных',
  2: 'ООП',
  3: 'Информатика'
}

export default function SubjectPage({ params }) {
  const { subjectId } = params
  const labs = labData[subjectId] || []
  const subjectName = subjectNames[subjectId] || 'Предмет'

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Лабораторные работы по {subjectName}</h1>
      <div className={styles.labsGrid}>
        {labs.map((lab, index) => (
          <Link 
            key={index} 
            href={`/uniworks/${subjectId}/${index + 1}`}
            className={styles.labLink}
          >
            <div className={styles.labCard}>
              {lab}
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}