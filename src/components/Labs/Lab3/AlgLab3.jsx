'use client'

import React, { useState, useRef } from 'react'
import styles from './AlgLab3.module.css'
import { SystemModel } from '@/scripts/lab3/lab3script'

const AlgLab3 = () => {
    const [system] = useState(new SystemModel(1));
    const [systemStates, setSystemStates] = useState([]);
    const [currentState, setCurrentState] = useState(null);
    const [manualTask, setManualTask] = useState({ arrivalTime: '', priority: '0', duration: '' });
    const [isRunning, setIsRunning] = useState(false);
    const intervalRef = useRef(null);

    // Добавление задачи вручную
    const handleAddManualTask = () => {
        if (!manualTask.duration.trim()) {
            alert('Введите длительность задачи!');
            return;
        }

        const duration = parseInt(manualTask.duration.trim());
        if (isNaN(duration) || duration <= 0) {
            alert('Введите корректную длительность!');
            return;
        }

        const priority = parseInt(manualTask.priority);
        const task = system.addTask(system.time, priority, duration);
        system.addTaskToQueue(task);

        setManualTask({ arrivalTime: '', priority: '0', duration: '' });
        updateSystemState();
    };

    // Генерация случайной задачи
    const handleGenerateRandomTask = () => {
        const task = system.generateRandomTask();
        updateSystemState();
    };

    // Выполнение одного такта
    const handleExecuteTick = () => {
        const state = system.executeTick();
        setSystemStates(prev => [...prev, state]);
        setCurrentState(state);
    };

    // Автоматический режим
    const handleStartAuto = () => {
        if (isRunning) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        } else {
            setIsRunning(true);
            intervalRef.current = setInterval(() => {
                handleExecuteTick();
            }, 1000);
        }
    };

    // Обновление состояния системы
    const updateSystemState = () => {
        setCurrentState(system.getSystemState());
    };

    // Сброс системы
    const handleReset = () => {
        system.reset();
        setSystemStates([]);
        setCurrentState(null);
        if (isRunning) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
        }
    };

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
                            <select 
                                value={manualTask.priority}
                                onChange={(e) => setManualTask({...manualTask, priority: e.target.value})}
                            >
                                <option value="0">F0 (Высший)</option>
                                <option value="1">F1 (Средний)</option>
                                <option value="2">F2 (Низший)</option>
                            </select>
                        </div>
                        
                        <div className={styles.taskInput}>
                            <label>Длительность: </label>
                            <input
                                type="text"
                                value={manualTask.duration}
                                onChange={(e) => setManualTask({...manualTask, duration: e.target.value})}
                                placeholder="Тактов"
                            />
                        </div>
                        
                        <button className={styles.buttonFillArray} onClick={handleAddManualTask}>
                            Добавить задачу
                        </button>
                        
                        <button className={styles.actionButton} onClick={handleGenerateRandomTask}>
                            Случайная задача
                        </button>
                    </div>

                    {/* Блок управления выполнением */}
                    <div className={styles.inputGroup}>
                        <button className={styles.buttonFillArray} onClick={handleExecuteTick}>
                            Выполнить такт
                        </button>
                        
                        <button 
                            className={isRunning ? styles.stopButton : styles.startButton}
                            onClick={handleStartAuto}
                        >
                            {isRunning ? 'Стоп' : 'Авто'}
                        </button>
                        
                        <button className={styles.actionButton} onClick={handleReset}>
                            Сброс
                        </button>
                    </div>

                    {/* Текущее состояние системы */}
                    {currentState && (
                        <div className={styles.systemState}>
                            <h3>Текущее состояние (Время: {currentState.time})</h3>
                            
                            <div className={styles.stateGrid}>
                                <div className={styles.stateItem}>
                                    <strong>Процессор:</strong>
                                    <div className={styles.stateValue}>
                                        {currentState.processor}
                                    </div>
                                </div>
                                
                                <div className={styles.stateItem}>
                                    <strong>Стек:</strong>
                                    <div className={styles.stateValue}>
                                        {currentState.stack}
                                    </div>
                                </div>
                                
                                <div className={styles.stateItem}>
                                    <strong>Очередь F0:</strong>
                                    <div className={styles.stateValue}>
                                        {currentState.queues.F0}
                                    </div>
                                </div>
                                
                                <div className={styles.stateItem}>
                                    <strong>Очередь F1:</strong>
                                    <div className={styles.stateValue}>
                                        {currentState.queues.F1}
                                    </div>
                                </div>
                                
                                <div className={styles.stateItem}>
                                    <strong>Очередь F2:</strong>
                                    <div className={styles.stateValue}>
                                        {currentState.queues.F2}
                                    </div>
                                </div>
                                
                                <div className={styles.stateItem}>
                                    <strong>Завершено задач:</strong>
                                    <div className={styles.stateValue}>
                                        {currentState.completedTasks}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* История состояний */}
                    {systemStates.length > 0 && (
                        <div className={styles.history}>
                            <h3>История выполнения</h3>
                            <div className={styles.historyList}>
                                {systemStates.map((state, index) => (
                                    <div key={index} className={styles.historyItem}>
                                        <strong>Такт {state.time}:</strong>
                                        {state.events && state.events.map((event, i) => (
                                            <div key={i} className={styles.event}>• {event}</div>
                                        ))}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

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