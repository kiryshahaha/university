import React from 'react'
import { labComponents, labTitles } from '@/components/Labs/LabComponents'
import styles from './page.module.css'

const subjectNames = {
  1: 'Алгоритмы и структуры данных',
  2: 'ООП',
  3: 'Информатика'
}

export default async function LabPage({ params }) {
  // Ожидаем параметры
  const { subjectId, labId } = await params
  const labKey = `${subjectId}-${labId}`
  
  const LabComponent = labComponents[labKey]
  const labTitle = labTitles[labKey] || `Лабораторная работа ${labId}`
  const subjectName = subjectNames[subjectId] || 'Предмет'

  if (!LabComponent) {
    return (
      <div className={styles.container}>
        <h1>Лабораторная работа не найдена</h1>
        <p>Лабораторная работа {labId} по {subjectName} не существует</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <LabComponent />
      </div>
    </div>
  )
}