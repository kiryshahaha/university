'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './AlgLab4.module.css'
import { HashTable, createHashTable } from '@/scripts/lab4/hashTable'

const AlgLab4 = () => {
  const [hashTable] = useState(() => createHashTable(1500))
  const [dataInput, setDataInput] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [segmentSearch, setSegmentSearch] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lastOperation, setLastOperation] = useState(null)
  const [tableItems, setTableItems] = useState([])
  const [stats, setStats] = useState({})
  const tableContainerRef = useRef(null)
  const fileInputRef = useRef(null)

  // Инициализация и обновление состояния
  useEffect(() => {
    updateDisplay()
  }, [])

  const updateDisplay = () => {
    // Получаем все 1500 сегментов
    const allItems = []
    for (let i = 0; i < 1500; i++) {
      const segment = hashTable.table[i] || []
      allItems.push({
        segment: i,
        items: [...segment],
        count: segment.length
      })
    }
    setTableItems(allItems)
    setStats(hashTable.getStatistics())
  }

  const handleAddData = () => {
    if (!dataInput.trim()) {
      setMessage('Введите данные')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      try {
        const result = hashTable.add(dataInput.trim())
        setLastOperation(result)
        
        if (result.operation === 'added') {
          setMessage(`✅ Данные "${dataInput}" → ключ "${result.key}" → сегмент ${result.hash}`)
        } else if (result.operation === 'exists') {
          setMessage(`⚠️ Данные "${dataInput}" уже существуют (ключ: "${result.key}")`)
        }
        
        setDataInput('')
        updateDisplay()
      } catch (error) {
        setMessage(`❌ Ошибка: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  const handleSearchByData = () => {
    if (!searchInput.trim()) {
      setMessage('Введите данные для поиска')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      try {
        const result = hashTable.searchByData(searchInput.trim())
        if (result.count > 0) {
          setMessage(`✅ Найдено: данные "${searchInput}" → ключ "${result.key}" → сегмент ${result.hash}`)
          
          // Прокручиваем к найденному сегменту
          setTimeout(() => {
            scrollToSegment(result.hash)
          }, 100)
        } else {
          setMessage(`❌ Не найдено: данные "${searchInput}" → ключ "${result.key}" → сегмент ${result.hash}`)
        }
      } catch (error) {
        setMessage(`❌ Ошибка поиска: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  const handleSearchBySegment = () => {
    const segment = parseInt(segmentSearch)
    if (isNaN(segment) || segment < 0 || segment >= 1500) {
      setMessage('Введите корректный номер сегмента (0-1499)')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      try {
        const result = hashTable.searchBySegment(segment)
        if (result.count > 0) {
          setMessage(`✅ В сегменте ${segment} найдено ${result.count} элементов`)
          
          // Прокручиваем к запрошенному сегменту
          setTimeout(() => {
            scrollToSegment(segment)
          }, 100)
        } else {
          setMessage(`ℹ️ В сегменте ${segment} нет элементов`)
        }
      } catch (error) {
        setMessage(`❌ Ошибка: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  const scrollToSegment = (segment) => {
    if (tableContainerRef.current) {
      const rowHeight = 40 // примерная высота строки
      const scrollTo = segment * rowHeight
      tableContainerRef.current.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  const handleRemoveData = () => {
    if (!dataInput.trim()) {
      setMessage('Введите данные для удаления')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      try {
        const result = hashTable.remove(dataInput.trim())
        if (result.removed > 0) {
          setMessage(`✅ Данные "${dataInput}" удалены (ключ: ${result.key})`)
          setDataInput('')
          updateDisplay()
        } else {
          setMessage(`❌ Данные "${dataInput}" не найдены`)
        }
      } catch (error) {
        setMessage(`❌ Ошибка удаления: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  const handleExportToFile = () => {
    setIsLoading(true)
    setTimeout(() => {
      try {
        const csvData = hashTable.exportToCSV()
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'hash_table_data.csv'
        a.click()
        URL.revokeObjectURL(url)
        
        setMessage('✅ Данные выгружены в файл hash_table_data.csv')
      } catch (error) {
        setMessage(`❌ Ошибка экспорта: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  const handleImportFromFile = (event) => {
    const file = event.target.files[0]
    if (!file) return

    setIsLoading(true)
    setTimeout(() => {
      try {
        // Демо-импорт
        hashTable.reset()
        // Добавляем тестовые данные в разные сегменты
        const testData = [
          'Hello World', 'Test Data', 'Hash Table', 'Laboratory Work',
          'Open Hashing', 'Collision Resolution', 'Data Structure',
          'Algorithm', 'Programming', 'Computer Science'
        ]
        testData.forEach(data => hashTable.add(data))
        updateDisplay()
        setMessage(`✅ Данные загружены из файла ${file.name} (демо)`)
        setIsLoading(false)
      } catch (error) {
        setMessage(`❌ Ошибка импорта: ${error.message}`)
        setIsLoading(false)
      }
    }, 1000)
  }

  const handleResetTable = () => {
    hashTable.reset()
    setLastOperation(null)
    setMessage('🗑️ Хеш-таблица сброшена')
    updateDisplay()
  }

  const handleKeyPress = (e, action) => {
    if (e.key === 'Enter') {
      action()
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.name}>
        <h1>Лабораторная работа 4: Хеширование данных</h1>
      </div>

      <section className={styles.section}>
        <h2>Цель работы:</h2>
        <p>Изучение методов хеширования данных и получение практических навыков реализации хеш-таблиц.</p>
        
        <h2>Задание (Вариант 9):</h2>
        <p>
          <strong>Формат ключа:</strong> БццццБ (Буква+4 цифры+Буква)<br/>
          <strong>Количество сегментов:</strong> 1500<br/>
          <strong>Метод разрешения коллизий:</strong> Открытое хеширование (цепочки)
        </p>

        <div className={styles.mainGroup}>
          <div className={styles.mainGroupText}>
            <span>Управление хеш-таблицей</span>
          </div>

          {/* Информация о последней операции */}
          {lastOperation && (
            <div className={styles.lastOperation}>
              <h3>Последняя операция:</h3>
              <div>Ключ: <strong>{lastOperation.key}</strong></div>
              <div>Сегмент: <strong>{lastOperation.hash}</strong></div>
              <div>Тип: <strong>{lastOperation.operation === 'added' ? 'Добавление' : 'Уже существует'}</strong></div>
            </div>
          )}

          {/* Статистика системы */}
          <div className={styles.systemStats}>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.totalElements || 0}</div>
              <div className={styles.statLabel}>Всего элементов</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.usedSegments || 0}</div>
              <div className={styles.statLabel}>Занято сегментов</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.emptySegments || 0}</div>
              <div className={styles.statLabel}>Свободно сегментов</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.maxChainLength || 0}</div>
              <div className={styles.statLabel}>Макс. длина цепочки</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.loadFactor || '0.0'}%</div>
              <div className={styles.statLabel}>Коэф. заполнения</div>
            </div>
          </div>

          {/* Блок добавления/удаления элементов */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Данные: </label>
              <input
                type="text"
                placeholder="Любые данные..."
                value={dataInput}
                onChange={(e) => setDataInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddData)}
              />
            </div>
            
            <button 
              className={styles.buttonFillArray} 
              onClick={handleAddData}
              disabled={isLoading}
            >
              {isLoading ? 'Добавление...' : 'Добавить данные'}
            </button>
            
            <button 
              className={styles.actionButton} 
              onClick={handleRemoveData}
              disabled={isLoading}
            >
              Удалить данные
            </button>
          </div>

          {/* Блок поиска */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Поиск по данным: </label>
              <input
                type="text"
                placeholder="Любые данные..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleSearchByData)}
              />
            </div>
            
            <button 
              className={styles.buttonFillArray} 
              onClick={handleSearchByData}
              disabled={isLoading}
            >
              {isLoading ? 'Поиск...' : 'Найти по данным'}
            </button>

            <div className={styles.taskInput}>
              <label>Поиск по сегменту: </label>
              <input
                type="number"
                placeholder="0-1499"
                value={segmentSearch}
                onChange={(e) => setSegmentSearch(e.target.value)}
                min="0"
                max="1499"
                onKeyPress={(e) => handleKeyPress(e, handleSearchBySegment)}
              />
            </div>
            
            <button 
              className={styles.actionButton} 
              onClick={handleSearchBySegment}
              disabled={isLoading}
            >
              Найти в сегменте
            </button>
          </div>

          {/* Блок управления файлами */}
          <div className={styles.inputGroup}>
            <button 
              className={styles.buttonFillArray} 
              onClick={handleExportToFile}
              disabled={isLoading}
            >
              {isLoading ? 'Экспорт...' : 'Экспорт в CSV'}
            </button>
            
            <input
              type="file"
              accept=".csv,.txt"
              onChange={handleImportFromFile}
              ref={fileInputRef}
              style={{ display: 'none' }}
            />
            
            <button 
              className={styles.actionButton}
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading}
            >
              Импорт из файла
            </button>
            
            <button 
              className={styles.stopButton} 
              onClick={handleResetTable}
            >
              Сброс таблицы
            </button>
          </div>

          {/* Визуализация хеш-таблицы */}
          <div className={styles.hashVisualization}>
            <h3>Визуализация хеш-таблицы (все 1500 сегментов)</h3>
            <div className={styles.tableInfo}>
              Всего сегментов: {tableItems.length}. Используйте прокрутку для просмотра.
            </div>
            <div className={styles.hashTableContainer}>
              <div 
                className={styles.tableWrapper}
                ref={tableContainerRef}
              >
                <div className={styles.tableHeader}>
                  <span>Сегмент</span>
                  <span>Количество</span>
                  <span>Данные → Ключ</span>
                </div>
                <div className={styles.tableContent}>
                  {tableItems.map((segmentInfo) => (
                    <div 
                      key={segmentInfo.segment} 
                      className={styles.tableRow}
                      id={`segment-${segmentInfo.segment}`}
                    >
                      <span className={styles.segmentNumber}>{segmentInfo.segment}</span>
                      <span className={styles.segmentCount}>
                        {segmentInfo.count} элемент(ов)
                      </span>
                      <div className={styles.segmentItems}>
                        {segmentInfo.count > 0 ? (
                          segmentInfo.items.map((item, itemIndex) => (
                            <div key={itemIndex} className={styles.dataItem}>
                              <span className={styles.originalData}>"{item.originalData}"</span>
                              <span className={styles.arrow}>→</span>
                              <span className={styles.generatedKey}>{item.key}</span>
                            </div>
                          ))
                        ) : (
                          <span className={styles.empty}>Пусто</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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
              <strong>Процесс работы:</strong> Данные → Ключ (БццццБ) → Хеш → Сегмент<br/>
              <strong>Метод хеширования:</strong> Открытое хеширование (цепочки)<br/>
              <strong>Формат ключа:</strong> БццццБ (Буква+4 цифры+Буква)<br/>
              <strong>Количество сегментов:</strong> {stats.totalSegments || 1500}<br/>
              <strong>Функции:</strong> добавление, удаление, поиск, экспорт/импорт
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AlgLab4