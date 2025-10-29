'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './AlgLab3.module.css'
import { SystemModel } from '@/scripts/lab3/lab3script'

const AlgLab3 = () => {
  const [system, setSystem] = useState(() => new SystemModel(1));
  const [systemState, setSystemState] = useState(null);
  const [priority, setPriority] = useState('0');
  const [duration, setDuration] = useState('');
  const [stackSize, setStackSize] = useState(1);
  const [isAutoMode, setIsAutoMode] = useState(false);
  const autoIntervalRef = useRef(null);

  useEffect(() => {
    //состояние системы
    setSystemState(system.getState());
    return () => {
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    };
  }, [system]);

  //функция для изменения размера стека
  const handleStackSizeChange = (newSize) => {
    if (newSize >= 1 && newSize <= 10) {
      const newSystem = new SystemModel(newSize);
      
      //сохраняем текущее состояние (если есть)
      if (systemState) {
      }
      
      setSystem(newSystem);
      setSystemState(newSystem.getState());
      setStackSize(newSize);
    }
  };

  const handleAddTask = () => {
    if (duration && !isNaN(duration) && parseInt(duration) > 0) {
      system.addTask(parseInt(priority), parseInt(duration));
      setSystemState(system.getState());
      setDuration('');
    }
  };

  const handleAddRandomTask = () => {
    system.addRandomTask();
    setSystemState(system.getState());
  };

  const handleExecuteTick = () => {
    system.executeTick();
    setSystemState(system.getState());
  };

  const handleAutoMode = () => {
    if (isAutoMode) {
      setIsAutoMode(false);
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    } else {
      setIsAutoMode(true);
      autoIntervalRef.current = setInterval(() => {
        system.executeTick();
        setSystemState(system.getState());
      }, 1000);
    }
  };

  const handleReset = () => {
    system.reset();
    setSystemState(system.getState());
    if (isAutoMode) {
      setIsAutoMode(false);
      if (autoIntervalRef.current) {
        clearInterval(autoIntervalRef.current);
      }
    }
  };

  const formatTaskInfo = (task) => {
    if (!task) return null;
    return `ID:${task.id} P:${task.priority} T:${task.remainingTime}/${task.duration}`;
  };

  if (!systemState) return <div>Загрузка...</div>;

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

          {/* Блок настройки системы */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Размер стека: </label>
              <select 
                value={stackSize} 
                onChange={(e) => handleStackSizeChange(parseInt(e.target.value))}
              >
                <option value="1">1 задача</option>
                <option value="2">2 задачи</option>
                <option value="3">3 задачи</option>
                <option value="5">5 задач</option>
                <option value="10">10 задач</option>
              </select>
            </div>
            
            <div className={styles.systemInfo}>
              <span>Текущий размер стека: <strong>{stackSize}</strong></span>
              <span>Стек заполнен: <strong>{systemState.stack.length}/{stackSize}</strong></span>
            </div>
          </div>

          {/* Блок добавления задач */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Приоритет: </label>
              <select value={priority} onChange={(e) => setPriority(e.target.value)}>
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
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
              />
            </div>
            
            <button className={styles.buttonFillArray} onClick={handleAddTask}>
              Добавить задачу
            </button>
            
            <button className={styles.actionButton} onClick={handleAddRandomTask}>
              Случайная задача
            </button>
          </div>

          {/* Блок управления выполнением */}
          <div className={styles.inputGroup}>
            <button className={styles.buttonFillArray} onClick={handleExecuteTick}>
              Выполнить такт ({systemState.time})
            </button>
            
            <button 
              className={isAutoMode ? styles.stopButton : styles.startButton} 
              onClick={handleAutoMode}
            >
              {isAutoMode ? 'Стоп' : 'Авто'}
            </button>
            
            <button className={styles.actionButton} onClick={handleReset}>
              Сброс
            </button>
          </div>

          {/* Визуализация состояния системы */}
          <div className={styles.systemVisualization}>
            <div className={styles.processor}>
              <h3>Процессор (P)</h3>
              <div className={styles.processorContent}>
                {systemState.processor ? (
                  <div className={`${styles.task} ${systemState.isProcessorInterrupted ? styles.interrupted : ''} ${styles[`priority-${systemState.processor.priority}`]}`}>
                    <div className={styles.taskInfo}>
                      {formatTaskInfo(systemState.processor)}
                    </div>
                    {systemState.isProcessorInterrupted && <span className={styles.interruptedBadge}>Прервана</span>}
                  </div>
                ) : (
                  <div className={styles.empty}>Свободен</div>
                )}
              </div>
            </div>

            <div className={styles.queues}>
              <h3>Очереди</h3>
              <div className={styles.queueGroup}>
                <div className={`${styles.queue} ${styles['queue-f0']}`}>
                  <h4>F0 (Высший приоритет)</h4>
                  <div className={styles.queueContent}>
                    {systemState.queues[0].map(task => (
                      <div key={task.id} className={`${styles.task} ${styles[`priority-${task.priority}`]}`}>
                        <div className={styles.taskInfo}>
                          {formatTaskInfo(task)}
                        </div>
                      </div>
                    ))}
                    {systemState.queues[0].length === 0 && (
                      <div className={styles.empty}>Пусто</div>
                    )}
                  </div>
                </div>
                
                <div className={`${styles.queue} ${styles['queue-f1']}`}>
                  <h4>F1 (Средний приоритет)</h4>
                  <div className={styles.queueContent}>
                    {systemState.queues[1].map(task => (
                      <div key={task.id} className={`${styles.task} ${styles[`priority-${task.priority}`]}`}>
                        <div className={styles.taskInfo}>
                          {formatTaskInfo(task)}
                        </div>
                      </div>
                    ))}
                    {systemState.queues[1].length === 0 && (
                      <div className={styles.empty}>Пусто</div>
                    )}
                  </div>
                </div>
                
                <div className={`${styles.queue} ${styles['queue-f2']}`}>
                  <h4>F2 (Низший приоритет)</h4>
                  <div className={styles.queueContent}>
                    {systemState.queues[2].map(task => (
                      <div key={task.id} className={`${styles.task} ${styles[`priority-${task.priority}`]}`}>
                        <div className={styles.taskInfo}>
                          {formatTaskInfo(task)}
                        </div>
                      </div>
                    ))}
                    {systemState.queues[2].length === 0 && (
                      <div className={styles.empty}>Пусто</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.stack}>
              <h3>Стек (S)</h3>
              <div className={`${styles.stackContent} ${systemState.stack.length >= stackSize ? styles.full : ''}`}>
                {systemState.stack.map((task, index) => (
                  <div key={task.id} className={`${styles.task} ${styles.interrupted}`}>
                    <div className={styles.taskInfo}>
                      {formatTaskInfo(task)}
                    </div>
                    <div className={styles.stackPosition}>
                      #{systemState.stack.length - index}
                    </div>
                  </div>
                ))}
                {systemState.stack.length === 0 && (
                  <div className={styles.empty}>Пуст</div>
                )}
                {systemState.stack.length > 0 && systemState.stack.length < stackSize && (
                  <div className={styles.stackInfo}>
                    Свободно: {stackSize - systemState.stack.length}
                  </div>
                )}
                {systemState.stack.length >= stackSize && (
                  <div className={styles.stackWarning}>
                    ⚠️ Стек заполнен!
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Статистика системы */}
          <div className={styles.systemStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{systemState.time}</div>
              <div className={styles.statLabel}>Текущее время</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{systemState.completed}</div>
              <div className={styles.statLabel}>Выполнено задач</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{systemState.queues[0].length + systemState.queues[1].length + systemState.queues[2].length}</div>
              <div className={styles.statLabel}>В очередях</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{systemState.stack.length}</div>
              <div className={styles.statLabel}>В стеке</div>
            </div>
          </div>

          {/* Информация о системе */}
          <div className={styles.result}>
            <span className={styles.resultText}>Информация о системе</span>
            <div className={styles.resultContent}>
              <strong>Текущее время:</strong> {systemState.time} тактов<br/>
              <strong>Процессор:</strong> 1<br/>
              <strong>Очереди:</strong> F0 (приоритет 0), F1 (приоритет 1), F2 (приоритет 2)<br/>
              <strong>Стек:</strong> статический, размер = {stackSize}<br/>
              <strong>Очереди:</strong> динамические (без ограничения размера)<br/>
              <strong>Выполнено задач:</strong> {systemState.completed}<br/>
              <strong>Задач в стеке:</strong> {systemState.stack.length}/{stackSize}
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AlgLab3;