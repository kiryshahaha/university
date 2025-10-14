'use client'

import React from 'react'
import styles from './AlgLab3.module.css'

const AlgLab3 = () => {
    return (
        <div className={styles.container}>
            <div className={styles.name}>
                <h1>Лабораторная работа 3: Моделирование системы с очередями и стеком</h1>
            </div>

            <section className={styles.section}>
                <h2>Цель работы:</h2>
                <p>Моделирование работы системы с процессором, приоритетными очередями и стеком для обработки прерываний.</p>
                
                <h2>Задание:</h2>
                <p>Система состоит из процессора, трёх очередей (F0, F1, F2) и стека. 
                   Задачи поступают в соответствующие приоритетам очереди. При поступлении задачи 
                   с более высоким приоритетом текущая задача прерывается и сохраняется в стеке.</p>

                <div className={styles.mainGroup}>
                    <div className={styles.mainGroupText}>
                        <span>Управление системой</span>
                    </div>

                    {/* Блок добавления задач */}
                    <div className={styles.inputGroup}>
                        <div className={styles.taskInput}>
                            <label>Приоритет: </label>
                            <select>
                                <option value="0">F0 (Высший)</option>
                                <option value="1">F1 (Средний)</option>
                                <option value="2">F2 (Низший)</option>
                            </select>
                        </div>
                        
                        <div className={styles.taskInput}>
                            <label>Длительность: </label>
                            <input
                                type="text"
                                placeholder="Тактов"
                            />
                        </div>
                        
                        <button className={styles.buttonFillArray}>
                            Добавить задачу
                        </button>
                        
                        <button className={styles.actionButton}>
                            Случайная задача
                        </button>
                    </div>

                    {/* Блок управления выполнением */}
                    <div className={styles.inputGroup}>
                        <button className={styles.buttonFillArray}>
                            Выполнить такт
                        </button>
                        
                        <button className={styles.startButton}>
                            Авто
                        </button>
                        
                        <button className={styles.actionButton}>
                            Сброс
                        </button>
                    </div>

                    {/* Информация о системе */}
                    <div className={styles.result}>
                        <span className={styles.resultText}>Информация о системе</span>
                        <div className={styles.resultContent}>
                            <strong>Процессор:</strong> 1<br/>
                            <strong>Очереди:</strong> F0 (приоритет 0), F1 (приоритет 1), F2 (приоритет 2)<br/>
                            <strong>Стек:</strong> статический, размер = 1<br/>
                            <strong>Очереди:</strong> динамические (без ограничения размера)<br/>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default AlgLab3;