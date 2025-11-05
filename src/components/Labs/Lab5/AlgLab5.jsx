'use client'

import React, { useState, useEffect } from 'react'
import styles from './AlgLab5.module.css'
import { 
    executeVariant6,
    generateRandomArray,
    parseArrayInput,
    addElement,
    removeElement,
    clearArray
} from '@/scripts/lab5/sortingAlgorithms'

const AlgLab5 = () => {
    const [array, setArray] = useState([])
    const [arrayInput, setArrayInput] = useState('')
    const [arraySize, setArraySize] = useState(20)
    const [addInput, setAddInput] = useState('')
    const [removeInput, setRemoveInput] = useState('')
    const [message, setMessage] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [stats, setStats] = useState({
        comparisons: 0,
        swaps: 0,
        uniqueCount: 0
    })
    const [currentArray, setCurrentArray] = useState([])

    // Инициализация массива
    useEffect(() => {
        handleGenerateArray()
    }, [])

    const handleGenerateArray = () => {
        setIsLoading(true)
        setTimeout(() => {
            try {
                const newArray = generateRandomArray(arraySize)
                setArray(newArray)
                setCurrentArray(newArray)
                setMessage(`✅ Сгенерирован новый массив из ${arraySize} элементов`)
                resetStats()
            } catch (error) {
                setMessage(`❌ Ошибка генерации: ${error.message}`)
            } finally {
                setIsLoading(false)
            }
        }, 100)
    }

    const resetStats = () => {
        setStats({
            comparisons: 0,
            swaps: 0,
            uniqueCount: 0
        })
    }

    const handleManualArrayInput = () => {
        if (!arrayInput.trim()) {
            setMessage('Введите элементы массива')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            try {
                const result = parseArrayInput(arrayInput)
                if (result.success) {
                    setArray(result.array)
                    setCurrentArray(result.array)
                    setMessage(`✅ Массив установлен: ${result.length} элементов`)
                    resetStats()
                } else {
                    setMessage(`❌ Ошибка: ${result.error}`)
                }
                setArrayInput('')
            } catch (error) {
                setMessage('❌ Ошибка: введите числа через запятую (например: 5,7,9,1,3,8)')
            } finally {
                setIsLoading(false)
            }
        }, 100)
    }

    const performSort = () => {
        if (array.length === 0) {
            setMessage('❌ Массив пуст')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            try {
                const result = executeVariant6(array)
                if (result.success) {
                    setCurrentArray(result.sortedArray)
                    setStats({
                        comparisons: result.summary.totalComparisons,
                        swaps: result.summary.totalSwaps,
                        uniqueCount: result.summary.uniqueElements
                    })
                    setMessage(`✅ Массив отсортирован! Уникальных чисел: ${result.summary.uniqueElements}`)
                } else {
                    setMessage(`❌ Ошибка: ${result.error}`)
                }
            } catch (error) {
                setMessage(`❌ Ошибка сортировки: ${error.message}`)
            } finally {
                setIsLoading(false)
            }
        }, 100)
    }

    const handleAddElement = () => {
        if (!addInput.trim()) {
            setMessage('Введите элемент для добавления')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            try {
                const value = parseInt(addInput)
                if (isNaN(value)) {
                    setMessage('❌ Введите корректное число')
                    return
                }

                const result = addElement(array, value)
                setArray(result.newArray)
                setCurrentArray(result.newArray)
                setStats({
                    comparisons: result.sortStats.comparisons,
                    swaps: result.sortStats.swaps,
                    uniqueCount: result.uniqueStats.uniqueCount
                })
                setMessage(`✅ Элемент ${value} добавлен. Уникальных чисел: ${result.uniqueStats.uniqueCount}`)
                setAddInput('')
            } catch (error) {
                setMessage(`❌ Ошибка добавления: ${error.message}`)
            } finally {
                setIsLoading(false)
            }
        }, 100)
    }

    const handleRemoveElement = () => {
        if (!removeInput.trim()) {
            setMessage('Введите элемент для удаления')
            return
        }

        setIsLoading(true)
        setTimeout(() => {
            try {
                const value = parseInt(removeInput)
                if (isNaN(value)) {
                    setMessage('❌ Введите корректное число')
                    return
                }

                const result = removeElement(array, value)
                setArray(result.newArray)
                setCurrentArray(result.newArray)
                setStats({
                    comparisons: result.sortStats.comparisons,
                    swaps: result.sortStats.swaps,
                    uniqueCount: result.uniqueStats.uniqueCount
                })
                
                if (result.removedCount > 0) {
                    setMessage(`🗑️ Удалено ${result.removedCount} элементов ${value}. Уникальных чисел: ${result.uniqueStats.uniqueCount}`)
                } else {
                    setMessage(`ℹ️ Элемент ${value} не найден в массиве`)
                }
                setRemoveInput('')
            } catch (error) {
                setMessage(`❌ Ошибка удаления: ${error.message}`)
            } finally {
                setIsLoading(false)
            }
        }, 100)
    }

    const handleClearArray = () => {
        setIsLoading(true)
        setTimeout(() => {
            try {
                const result = clearArray()
                setArray(result.newArray)
                setCurrentArray(result.newArray)
                setStats({
                    comparisons: result.sortStats.comparisons,
                    swaps: result.sortStats.swaps,
                    uniqueCount: result.uniqueStats.uniqueCount
                })
                setMessage('🗑️ Массив очищен')
            } catch (error) {
                setMessage(`❌ Ошибка очистки: ${error.message}`)
            } finally {
                setIsLoading(false)
            }
        }, 100)
    }

    const handleKeyPress = (e, action) => {
        if (e.key === 'Enter') {
            action()
        }
    }

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                <h1>Лабораторная работа 5: Алгоритмы сортировки</h1>
            </div>

            <section className={styles.section}>
                <h2>Цель работы:</h2>
                <p>Изучение алгоритмов внутренней сортировки и получение практических навыков их использования, и анализа их сложности.</p>
                
                <h2>Задание (Вариант 6):</h2>
                <p>
                    <strong>Задача:</strong> Найти количество различных чисел среди элементов массива<br/>
                    <strong>Алгоритм сортировки:</strong> Чётно-нечётная сортировка
                </p>

                <div className={styles.mainGroup}>
                    <div className={styles.mainGroupText}>
                        <span>Управление массивом и сортировка</span>
                    </div>

                    {/* Статистика системы */}
                    <div className={styles.systemStats}>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{stats.comparisons}</div>
                            <div className={styles.statLabel}>Сравнений</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{stats.swaps}</div>
                            <div className={styles.statLabel}>Перестановок</div>
                        </div>
                        <div className={styles.statItem}>
                            <div className={styles.statValue}>{stats.uniqueCount}</div>
                            <div className={styles.statLabel}>Уникальных чисел</div>
                        </div>
                    </div>

                    {/* Генерация массива */}
                    <div className={styles.inputGroup}>
                        <div className={styles.taskInput}>
                            <label>Размер массива: </label>
                            <input
                                type="number"
                                value={arraySize}
                                onChange={(e) => setArraySize(parseInt(e.target.value) || 20)}
                                min="5"
                                max="100"
                            />
                        </div>
                        
                        <button 
                            className={styles.buttonFillArray} 
                            onClick={handleGenerateArray}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Генерация...' : 'Сгенерировать массив'}
                        </button>

                        <button 
                            className={styles.stopButton} 
                            onClick={handleClearArray}
                            disabled={isLoading}
                        >
                            Очистить массив
                        </button>
                    </div>

                    {/* Ручной ввод массива */}
                    <div className={styles.inputGroup}>
                        <div className={styles.taskInput}>
                            <label>Ручной ввод массива: </label>
                            <input
                                type="text"
                                placeholder="Числа через запятую (5,7,9,1,3,8)"
                                value={arrayInput}
                                onChange={(e) => setArrayInput(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleManualArrayInput)}
                            />
                        </div>
                        
                        <button 
                            className={styles.actionButton} 
                            onClick={handleManualArrayInput}
                            disabled={isLoading}
                        >
                            Установить массив
                        </button>
                    </div>

                    {/* Сортировка */}
                    <div className={styles.inputGroup}>
                        <button 
                            className={styles.buttonFillArray} 
                            onClick={performSort}
                            disabled={isLoading || array.length === 0}
                        >
                            {isLoading ? 'Сортировка...' : 'Выполнить сортировку'}
                        </button>
                        
                        <div className={styles.algorithmInfo}>
                            <strong>Алгоритм:</strong> Чётно-нечётная сортировка | 
                            <strong> Сложность:</strong> O(n²) | 
                            <strong> Память:</strong> O(1)
                        </div>
                    </div>

                    {/* Добавление/удаление элементов */}
                    <div className={styles.inputGroup}>
                        <div className={styles.taskInput}>
                            <label>Добавить элемент: </label>
                            <input
                                type="number"
                                placeholder="Число для добавления"
                                value={addInput}
                                onChange={(e) => setAddInput(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleAddElement)}
                            />
                        </div>
                        
                        <button 
                            className={styles.actionButton} 
                            onClick={handleAddElement}
                            disabled={isLoading}
                        >
                            Добавить
                        </button>

                        <div className={styles.taskInput}>
                            <label>Удалить элемент: </label>
                            <input
                                type="number"
                                placeholder="Число для удаления"
                                value={removeInput}
                                onChange={(e) => setRemoveInput(e.target.value)}
                                onKeyPress={(e) => handleKeyPress(e, handleRemoveElement)}
                            />
                        </div>
                        
                        <button 
                            className={styles.stopButton} 
                            onClick={handleRemoveElement}
                            disabled={isLoading}
                        >
                            Удалить
                        </button>
                    </div>

                    {/* Визуализация массива */}
                    <div className={styles.arrayVisualization}>
                        <h3>Визуализация массива ({currentArray.length} элементов)</h3>
                        <div className={styles.arrayContainer}>
                            <div className={styles.arrayElements}>
                                {currentArray.map((num, index) => (
                                    <div key={index} className={styles.arrayElement}>
                                        <span className={styles.elementValue}>{num}</span>
                                        <span className={styles.elementIndex}>{index}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className={styles.arrayInfo}>
                            Текущий массив: [{currentArray.join(', ')}]
                        </div>
                    </div>

                    {/* Сообщения системы */}
                    {message && (
                        <div className={styles.result}>
                            <span className={styles.resultText}>Состояние системы</span>
                            <div className={styles.resultContent}>
                                {message}
                            </div>
                        </div>
                    )}

                    {/* Информация о системе */}
                    <div className={styles.result}>
                        <span className={styles.resultText}>Информация о системе</span>
                        <div className={styles.resultContent}>
                            <strong>Алгоритм сортировки:</strong> Чётно-нечётная сортировка<br/>
                            <strong>Задача:</strong> Найти количество различных чисел среди элементов массива<br/>
                            <strong>Функции:</strong> генерация массива, ручной ввод, сортировка, добавление/удаление элементов, очистка массива<br/>
                            <strong>Статистика:</strong> подсчет сравнений, перестановок, уникальных элементов<br/>
                            <strong>Сложность алгоритма:</strong> O(n²) в худшем случае, O(n) в лучшем случае
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AlgLab5