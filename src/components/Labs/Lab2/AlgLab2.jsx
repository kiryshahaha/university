'use client'

import React, { useState } from 'react'
import styles from './AlgLab2.module.css'
import { processSequence, validateSequence, generateUniqueSequence, DoubleLL } from '@/scripts/lab2/lab2script'

const AlgLab2 = () => {

    const [inputValue, setInputValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [originalList, setOriginalList] = useState([]);
    const [beforeList, setBeforeList] = useState([]);
    const [afterList, setAfterList] = useState([]);
    const [showResult, setShowResult] = useState(false);
    const [list] = useState(new DoubleLL());

//создание списка
    const handleGenerateList = () => {
        try {
            const randomList = generateUniqueSequence(8, 1, 50);

            list.clear();

            randomList.forEach(num => list.insertLast(num));
            setOriginalList(list.toArray());
            setShowResult(false);
        } catch(error) {
            alert('Ошибка генерации: ' + error.message);
        }
    };

//константное добавление в список для теста
    const handleAddTest = () => {
        const testData = [5, 2, 8, 1, 9, 3];
        list.clear();

        testData.forEach(num => list.insertLast(num));

        setOriginalList(list.toArray());
        setShowResult(false);
    }

//добавление элемента в список
    const handleAddElement = () => {
        if(!inputValue.trim()){
            alert('Введите число!');
            return;
        }

        const num = parseInt(inputValue.trim());
        if(isNaN(num)){
            alert('Введите корректное число!');
            return;
        }

        if (list.findElement(num) !== null){
            alert('В списке уже есть это число!');
            return;
        }

        try{
            list.insertLast(num);

            setOriginalList(list.toArray());
            setInputValue('');
            setShowResult(false);
        } catch (error){
            alert('ошибка при добавлении элемента: ' + error.message);
        }
    };

    //удаление элемента из списка
    const handleRemoveElement = () => {
        if(!inputValue.trim()){
            alert('Введите число для удаления!');
            return;
        }

        const num = parseInt(inputValue.trim());
        if(isNaN(num)){
            alert('Введите корректное число!');
            return;
        }

        const removed = list.removeElement(num);
        if (!removed){
            alert('Элемент не найден в списке');
            return;
        }

        setOriginalList(list.toArray());
        setInputValue('');
        setShowResult(false);
    };

    //обработка последовательности
    const handleProcessSequence = () => {
        if(!searchValue.trim()){
            alert('Введите число `c` для поиска!');
            return;
        }

        const c = parseInt(searchValue.trim());
        if(isNaN(c)){
            alert('Введите корректное число `c`!');
            return;
        }

        if (list.length === 0){
            alert('Список пуст!');
            return;
        }

        try{
            const result = processSequence(list.toArray(), c);

            setBeforeList(result.beforeReverse);
            setAfterList(result.after);
            setShowResult(true);
        } catch(error){
            alert('Ошибка: ' + error.message);
        }

    };

    const handleClearAll = () => {
        list.clear();
        setOriginalList([]);
        setBeforeList([]);
        setAfterList([]);
        setShowResult(false);
        setInputValue('');
        setSearchValue('');
    };

    return (
        <div className={styles.container}>
            <div className={styles.name}>
                <h1>Лабораторная работа 2: ЛИНЕЙНЫЕ И ЦИКЛИЧЕСКИЕ СПИСКИ</h1>
            </div>

            <section className={styles.section}>
                <h2>Цель работы:</h2>
                <p>Целью работы является изучение структур данных «линейный
                    список» и «циклический список», а также получение практических навыков
                    их реализации.
                </p>
                <h2>Задание (Вариант 11):</h2>
                <p>Дана последовательность неповторяющихся чисел a₁, a₂ … an и некое число c, принадлежащее данной последовательности.
                    Составить 2 последовательности. Первая – все числа, находящиеся до указанного числа в обратном порядке.
                    Вторая – все числа после указанного числа в прямом порядке.</p>

                <div className={styles.mainGroup}>
                    <div className={styles.mainGroupText}>
                        <span>Выполнение задания</span>
                    </div>

                     {/* Блок управления */}
                    <div className={styles.inputGroup}>
                        <button className={styles.buttonFillArray} onClick={handleGenerateList}>
                            Сгенерировать последовательность
                        </button>
                        <button className={styles.actionButton} onClick={handleAddTest}>
                            Добавить тестовые данные
                        </button>
                    </div>

                    {/*Блок вывода элементов*/}
                    <div className={styles.inputGroup}>
                        <div className={styles.arraySizeInput}>
                            <label>Элемент списка: </label>
                            <input
                                type='text'
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                placeholder='Введите число'
                            />
                        </div>
                        <button className={styles.buttonFillArray} onClick={handleAddElement}>Добавить элемент</button>
                        <button className={styles.actionButton} onClick={handleRemoveElement}>Удалить элемент</button>
                    </div>

                    {/*Блок поиска*/}
                    <div className={styles.inputGroup}>
                        <div className={styles.arraySizeInput}>
                            <label>Число для поиска: </label>
                            <input
                                type='text'
                                value={searchValue}
                                onChange={(e) => setSearchValue(e.target.value)}
                                placeholder='Введите число c'
                            />
                        </div>
                        <button className={styles.buttonFillArray} onClick={handleProcessSequence}>Обработать последовательность</button>
                        <button className={styles.actionButton} onClick={handleClearAll}>Очистить всё</button>
                    </div>

                    {/*Отображение исходного списка*/}
                    {originalList.length > 0 && (
                        <div className={styles.arrayInfo}>
                            <div className={styles.arrayDisplay}>
                                <strong>Исходная последовательность: </strong>[{originalList.join(', ')}]
                            </div>
                            <div>
                                <strong>Количество элементов: </strong>{originalList.length}
                            </div>
                        </div>
                    )}

                    {showResult && (
                        <div className={styles.result}>
                            <span className={styles.resultext}>Результаты обработки</span>
                            <div className={styles.arrayInfo}>
                                <div className={styles.arrayDisplay}>
                                    <strong>Числа до {searchValue} (в обратном порядке): </strong><br />{beforeList.length > 0 ? `[${beforeList.join(', ')}]` : `Нет элементов`}
                                </div>
                                <div className={styles.arrayDisplay}>
                                    <strong>Числа после {searchValue} (в прямом порядке): </strong><br />{afterList.length > 0 ? `[${afterList.join(', ')}]` : `Нет элементов`}
                                </div>
                            </div>
                        </div>
                    )}

                    {/*Информация о списке*/}
                    <div className={styles.result}>
                        <span className={styles.resultText}>Информация о структуре списка</span>
                        <div className={styles.resultContent}>
                            <strong>Тип списка: </strong> Линейный двусвязный список<br />
                            <strong>Операции: </strong> Добавление, удаление, поиск, разделение<br/>
                        </div>
                    </div>

                </div>
            </section>
        </div>
    )
}

export default AlgLab2