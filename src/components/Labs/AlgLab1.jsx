'use client'

import React, { useState } from 'react'
import Image from 'next/image'
import styles from './AlgLab.module.css'
import TableLab1 from './TableLab1/TableLab1'
import { generateArray, calculateNegativeSum, getEvenCount } from '@/scripts/lab1/lab1script'

const AlgLab1 = () => {
    const [n, setN] = useState(10);
    const [minRange, setMinRange] = useState(0);
    const [maxRange, setMaxRange] = useState(0);
    const [array, setArray] = useState([]);
    const [evenCount, setEvenCount] = useState(0);
    const [showArrayInfo, setShowArrayInfo] = useState(false);
    const [showResult, setShowResult] = useState(false);
    const [result, setResult] = useState('');

    const handleFillArray = () => {
        try {
            const { array: newArray, minRange: minR, maxRange: maxR, evenCount: evenCounter } = generateArray(n);
            
            setMinRange(minR);
            setMaxRange(maxR);
            setArray(newArray);
            setEvenCount(evenCounter);
            setShowArrayInfo(true);
            setShowResult(false);
            setResult('');
        } catch (error) {
            alert(error.message);
        }
    };

    const handleCalculateNegativeSum = () => {
        const { sum, operations, complexity } = calculateNegativeSum(array);
        setResult(`Сумма отрицательных элементов: ${sum}\nВыполнено операций: ${operations}\nСложность алгоритма: ${complexity}`);
        setShowResult(true);
    };

    const handleGetEvenCount = () => {
        const { count, operations, complexity } = getEvenCount(evenCount);
        setResult(`Количество четных элементов: ${count}\nВыполнено операций: ${operations}\nСложность алгоритма: ${complexity}`);
        setShowResult(true);
    };

    const handleInputChange = (e) => {
        const value = parseInt(e.target.value);
        if (!isNaN(value) && value > 0) {
            setN(value);
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                <h1>Лабораторная работа 1: Анализ сложности алгоритмов</h1>
            </div>

            <section className={styles.section}>
                <h2>Цель работы:</h2>
                <p>Изучение методов и получение практических навыков анализа сложности алгоритмов.</p>

                <h2>Задание:</h2>
                <p>Используя память, пропорциональную n, хранить массив целых чисел A, содержащий n элементов.
                    Элементы массива A могут принимать случайные значения от -((n div 2) - 1) до (n div 2).
                    Разработать алгоритм, который осуществляет заполнение массива A случайными значениями,
                    и по выбору пользователя выполняет одну из двух функций.</p>

                <div className={styles.tableContainer}>
                    <TableLab1 />
                </div>


                <div className={styles.mainGroup}>
                    <div className={styles.mainGropText}>
                        <span>Выполнение задания</span>
                    </div>

                    <div className={styles.inputGroup}>
                        <div className={styles.arraySizeInput}>
                            <label>Размер массива (n):</label>
                            <input
                                type='number'
                                value={n}
                                onChange={handleInputChange}
                                min="1"
                            />
                        </div>
                        <button className={styles.buttonFillArray} onClick={handleFillArray}>
                            Заполнить массив
                        </button>
                    </div>

                    {showArrayInfo && (
                        <>
                            <div className={styles.arrayInfo}>
                                <div className={styles.arrayDisplay}>
                                    <strong>Массив:</strong> [{array.join(', ')}]
                                </div>
                                <div>
                                    <strong>Диапазон:</strong><br />от {minRange} до {maxRange}
                                </div>
                                <div>
                                    <strong>Размер:</strong><br />{n} элементов
                                </div>
                            </div>

                            <div className={styles.buttonGroup}>
                                <span>Выберите действие:</span>
                                <button className={styles.actionButton} onClick={handleCalculateNegativeSum}>
                                    ∑ Отрицательные элементы
                                </button>
                                <button className={styles.actionButton} onClick={handleGetEvenCount}>
                                    🔢 Четные элементы
                                </button>
                            </div>
                        </>
                    )}

                    {showResult && (
                        <div className={styles.result}>
                            <span className={styles.resultText}>Результат</span>
                            <div className={styles.resultContent}>{result}</div>
                        </div>
                    )}
                </div>
            </section>
        </div>
    )
}

export default AlgLab1