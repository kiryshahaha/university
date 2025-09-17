import React from 'react'
import styles from './TableLab1.module.css'

const TableLab1 = () => {
  return (
    <table className={styles.table}>
                        <thead>
                            <tr>
                                <th className={styles.mainHeader}>N варианта</th>
                                <th className={styles.mainHeader}>Функции</th>
                                <th className={styles.mainHeader}>T(n), не более</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td className={styles.var} rowSpan="2">9</td>
                                <td className={styles.functionCell}>
                                    <div className={styles.functionContent}>
                                        <span className={styles.functionName}>Подсчитать сумму всех элементов,</span>
                                        <span className={styles.functionName}>имеющих отрицательные значения</span>

                                    </div>
                                </td>
                                <td className={styles.var}><span className={styles.complexity}>O(n)</span></td>
                            </tr>
                            <tr>
                                {/* <td></td> */}
                                <td className={styles.functionCell}>
                                    <div className={styles.functionContent}>
                                        <span className={styles.functionName}>Подсчитать количество элементов</span>
                                        <span className={styles.functionName}>с четными значениями</span>
                                    </div>
                                </td>
                                <td className={styles.var}>
                                <span className={styles.complexity}>O(1)</span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
  )
}

export default TableLab1