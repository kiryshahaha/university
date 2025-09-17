import React from 'react'
import styles from './SubjectComponent.module.css'
import Image from 'next/image'
import Link from 'next/link'

const SubjectComponent = ({ subjectId, subjectPhoto, subjectTitle }) => {
  return (
    <Link href={`/uniworks/${subjectId}`} className={styles.link}>
      <div className={styles.container}>
        <div className={styles.subjectPhoto}>
          <Image 
            src={subjectPhoto} 
            alt={subjectTitle}
            fill
            style={{ objectFit: 'cover' }}
          />
        </div>
        <div className={styles.subjectTitle}>
          {subjectTitle}
        </div>
      </div>
    </Link>
  )
}

export default SubjectComponent