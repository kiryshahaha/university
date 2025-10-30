'use client'

import React, { useState, useRef, useEffect } from 'react'
import styles from './AlgLab4.module.css'
import { HashTable, createHashTable } from '@/scripts/lab4/hashTable'

const AlgLab4 = () => {
  const [hashTable] = useState(() => createHashTable(1500))
  const [keyInput, setKeyInput] = useState('')
  const [valueInput, setValueInput] = useState('')
  const [searchKeyInput, setSearchKeyInput] = useState('')
  const [segmentSearch, setSegmentSearch] = useState('')
  const [textToEncrypt, setTextToEncrypt] = useState('')
  const [encryptedKey, setEncryptedKey] = useState('')
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

  // Функция шифрования текста в ключ
  const encryptTextToKey = () => {
    if (!textToEncrypt.trim()) {
      setMessage('Введите текст для шифрования')
      return
    }

    try {
      const key = hashTable.generateKeyFromText(textToEncrypt.trim())
      setEncryptedKey(key)
      setMessage(`✅ Текст зашифрован в ключ: ${key}`)
    } catch (error) {
      setMessage(`❌ Ошибка шифрования: ${error.message}`)
    }
  }

  // Автоматическое добавление значения (значение → автоматический ключ)
  const handleAddValue = () => {
    if (!valueInput.trim()) {
      setMessage('Введите значение для добавления')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      try {
        // Автоматически генерируем ключ из значения
        const autoKey = hashTable.generateKeyFromText(valueInput.trim())
        const result = hashTable.add(autoKey, valueInput.trim())
        setLastOperation(result)
        
        if (result.operation === 'added') {
          setMessage(`✅ Элемент добавлен: значение "${valueInput}" → ключ "${autoKey}" → сегмент ${result.hash}`)
        } else if (result.operation === 'updated') {
          setMessage(`✏️ Элемент обновлен: значение "${valueInput}" → ключ "${autoKey}" → сегмент ${result.hash}`)
        }
        
        setValueInput('')
        updateDisplay()
      } catch (error) {
        setMessage(`❌ Ошибка: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  // Ручное добавление с указанием ключа
  const handleAddWithKey = () => {
    if (!keyInput.trim()) {
      setMessage('Введите ключ')
      return
    }
    if (!valueInput.trim()) {
      setMessage('Введите значение')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      try {
        const result = hashTable.add(keyInput.trim(), valueInput.trim())
        setLastOperation(result)
        
        if (result.operation === 'added') {
          setMessage(`✅ Элемент добавлен: ключ "${keyInput}" → значение "${valueInput}" → сегмент ${result.hash}`)
        } else if (result.operation === 'updated') {
          setMessage(`✏️ Элемент обновлен: ключ "${keyInput}" → значение "${valueInput}" → сегмент ${result.hash}`)
        }
        
        setKeyInput('')
        setValueInput('')
        updateDisplay()
      } catch (error) {
        setMessage(`❌ Ошибка: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 300)
  }

  // Использовать зашифрованный ключ для добавления
  const useEncryptedKey = () => {
    if (!encryptedKey) {
      setMessage('Сначала зашифруйте текст')
      return
    }
    setKeyInput(encryptedKey)
    setMessage(`🔑 Ключ "${encryptedKey}" готов к использованию`)
  }

  const handleSearchByKey = () => {
    if (!searchKeyInput.trim()) {
      setMessage('Введите ключ для поиска')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      try {
        const result = hashTable.searchByKey(searchKeyInput.trim())
        if (result.count > 0) {
          const values = result.found.map(item => item.value).join(', ')
          setMessage(`✅ Найдено: ключ "${searchKeyInput}" → сегмент ${result.hash} → значения: ${values}`)
          
          setTimeout(() => {
            scrollToSegment(result.hash)
          }, 100)
        } else {
          setMessage(`❌ Не найдено: ключ "${searchKeyInput}" → сегмент ${result.hash}`)
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
      const rowHeight = 40
      const scrollTo = segment * rowHeight
      tableContainerRef.current.scrollTo({
        top: scrollTo,
        behavior: 'smooth'
      })
    }
  }

  const handleRemoveByKey = () => {
    if (!keyInput.trim()) {
      setMessage('Введите ключ для удаления')
      return
    }

    setIsLoading(true)
    setTimeout(() => {
      try {
        const result = hashTable.remove(keyInput.trim())
        if (result.removed > 0) {
          setMessage(`✅ Элемент удален: ключ "${keyInput}" → сегмент ${result.hash}. Осталось элементов в сегменте: ${result.remainingCount}`)
          
          // Показываем оставшиеся элементы (коллизии)
          if (result.remainingCount > 0) {
            setTimeout(() => {
              const remainingKeys = result.remainingItems.map(item => item.key).join(', ')
              setMessage(prev => prev + `\n🔗 Оставшиеся ключи в сегменте: ${remainingKeys}`)
            }, 500)
          }
          
          setKeyInput('')
          updateDisplay()
        } else {
          setMessage(`❌ Элемент не найден: ключ "${keyInput}"`)
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
        const csvData = hashTable.exportForHistogram()
        const blob = new Blob([csvData], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = 'hash_table_histogram.csv'
        a.click()
        URL.revokeObjectURL(url)
        
        setMessage('✅ Данные для гистограммы выгружены в hash_table_histogram.csv')
      } catch (error) {
        setMessage(`❌ Ошибка экспорта: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  const handleBulkGenerate = () => {
    setIsLoading(true)
    setTimeout(() => {
      try {
        const result = hashTable.bulkAdd(2000) // Генерируем 100 элементов
        setMessage(`✅ Сгенерировано: добавлено ${result.added}, обновлено ${result.updated}. Ошибок: ${result.errors.length}`)
        
        if (result.errors.length > 0) {
          setTimeout(() => {
            setMessage(prev => prev + `\n⚠️ Переполнение: ${result.errors[0]}`)
          }, 500)
        }
        
        updateDisplay()
      } catch (error) {
        setMessage(`❌ Ошибка генерации: ${error.message}`)
      } finally {
        setIsLoading(false)
      }
    }, 500)
  }

  const handleResetTable = () => {
    hashTable.reset()
    setLastOperation(null)
    setEncryptedKey('')
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

          {/* Блок шифрования текста */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Шифрование текста в ключ: </label>
              <input
                type="text"
                placeholder="Любой текст для шифрования..."
                value={textToEncrypt}
                onChange={(e) => setTextToEncrypt(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, encryptTextToKey)}
              />
            </div>
            
            <button 
              className={styles.buttonFillArray} 
              onClick={encryptTextToKey}
              disabled={isLoading}
            >
              {isLoading ? 'Шифрование...' : 'Зашифровать в ключ'}
            </button>

            {encryptedKey && (
              <div className={styles.encryptedKey}>
                <span>Зашифрованный ключ: <strong>{encryptedKey}</strong></span>
                <button 
                  className={styles.actionButton}
                  onClick={useEncryptedKey}
                >
                  Использовать
                </button>
              </div>
            )}
          </div>

          {/* Информация о последней операции */}
          {lastOperation && (
            <div className={styles.lastOperation}>
              <h3>Последняя операция:</h3>
              <div>Ключ: <strong>{lastOperation.key}</strong></div>
              <div>Сегмент: <strong>{lastOperation.hash}</strong></div>
              <div>Тип: <strong>{lastOperation.operation === 'added' ? 'Добавление' : 'Обновление'}</strong></div>
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
              <div className={styles.statValue}>{stats.maxChainLength || 0}</div>
              <div className={styles.statLabel}>Макс. длина цепочки</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.loadFactor || '0.0'}%</div>
              <div className={styles.statLabel}>Коэф. заполнения</div>
            </div>
            <div className={styles.statItem}>
              <div className={styles.statValue}>{stats.overflowSegments || 0}</div>
              <div className={styles.statLabel}>Переполненные сегменты</div>
            </div>
          </div>

          {/* Блок добавления элементов */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Добавить значение (авто-ключ): </label>
              <input
                type="text"
                placeholder="Любое значение..."
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddValue)}
              />
            </div>
            
            <button 
              className={styles.buttonFillArray} 
              onClick={handleAddValue}
              disabled={isLoading}
            >
              {isLoading ? 'Добавление...' : 'Добавить значение'}
            </button>
          </div>

          {/* Блок ручного добавления с ключом */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Ключ (БццццБ): </label>
              <input
                type="text"
                placeholder="Например: A1234Z"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => handleKeyPress(e, handleAddWithKey)}
                maxLength={6}
              />
            </div>
            
            <div className={styles.taskInput}>
              <label>Значение: </label>
              <input
                type="text"
                placeholder="Любое значение..."
                value={valueInput}
                onChange={(e) => setValueInput(e.target.value)}
                onKeyPress={(e) => handleKeyPress(e, handleAddWithKey)}
              />
            </div>
            
            <button 
              className={styles.actionButton} 
              onClick={handleAddWithKey}
              disabled={isLoading}
            >
              Добавить с ключом
            </button>
          </div>

          {/* Блок поиска */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Поиск по ключу: </label>
              <input
                type="text"
                placeholder="Введите ключ БццццБ"
                value={searchKeyInput}
                onChange={(e) => setSearchKeyInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => handleKeyPress(e, handleSearchByKey)}
                maxLength={6}
              />
            </div>
            
            <button 
              className={styles.buttonFillArray} 
              onClick={handleSearchByKey}
              disabled={isLoading}
            >
              {isLoading ? 'Поиск...' : 'Найти по ключу'}
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

          {/* Блок удаления и управления */}
          <div className={styles.inputGroup}>
            <div className={styles.taskInput}>
              <label>Удалить по ключу: </label>
              <input
                type="text"
                placeholder="Введите ключ БццццБ"
                value={keyInput}
                onChange={(e) => setKeyInput(e.target.value.toUpperCase())}
                onKeyPress={(e) => handleKeyPress(e, handleRemoveByKey)}
                maxLength={6}
              />
            </div>
            
            <button 
              className={styles.stopButton} 
              onClick={handleRemoveByKey}
              disabled={isLoading}
            >
              Удалить по ключу
            </button>

            <button 
              className={styles.buttonFillArray} 
              onClick={handleExportToFile}
              disabled={isLoading}
            >
              {isLoading ? 'Экспорт...' : 'Экспорт гистограммы'}
            </button>
            
            <button 
              className={styles.actionButton}
              onClick={handleBulkGenerate}
              disabled={isLoading}
            >
              Сгенерировать 2000 элементов
            </button>
            
            <button 
              className={styles.stopButton} 
              onClick={handleResetTable}
            >
              Сброс таблицы
            </button>
          </div>

                    {/* Сообщения системы */}
          {message && (
            <div className={styles.result}>
              <span className={styles.resultText}>Состояние системы</span>
              <div className={styles.resultContent}>
                {message.split('\n').map((line, index) => (
                  <div key={index}>{line}</div>
                ))}
              </div>
            </div>
          )}


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
                  <span>Ключ → Значение</span>
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
                              <span className={styles.generatedKey}>{item.key}</span>
                              <span className={styles.arrow}>→</span>
                              <span className={styles.originalData}>"{item.value}"</span>
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


          {/* Информация о системе */}
          <div className={styles.result}>
            <span className={styles.resultText}>Информация о системе</span>
            <div className={styles.resultContent}>
              <strong>Формат ключа:</strong> БццццБ (Буква+4 цифры+Буква)<br/>
              <strong>Примеры ключей:</strong> A1234Z, B5678X, C9012Y<br/>
              <strong>Метод хеширования:</strong> Открытое хеширование (цепочки)<br/>
              <strong>Количество сегментов:</strong> {stats.totalSegments || 1500}<br/>
              <strong>Макс. длина цепочки:</strong> {stats.MAX_CHAIN_LENGTH || 5}<br/>
              <strong>Функции:</strong> автоматическое шифрование значений, ручное указание ключей, поиск, удаление, экспорт гистограммы
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AlgLab4