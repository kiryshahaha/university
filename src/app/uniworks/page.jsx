import React from 'react'
import styles from './UniWorks.module.css'
import SubjectComponent from '@/components/subjectComponent/SubjectComponent'

export default function UniWorks() {
  const subjects = [
    {
      id: 1,
      photo: '/photos/Alg.png',
      title: 'Алгоритмы и струтуры данных'
    },
    {
      id: 2,
      photo: '/photos/OOP.png',
      title: 'ООП'
    },
    {
      id: 3,
      photo: '/photos/Inf.jpg',
      title: 'Информатика'
    },
    {
      id: 4,
      photo: '/photos/Gram.JPG',
      title: 'ОЦГ'
    },
]

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {subjects.map(subject => (
          <SubjectComponent
            key={subject.id}
            subjectId={subject.id}
            subjectPhoto={subject.photo}
            subjectTitle={subject.title}
          />
        ))}
      </div>
    </div>
  )
}