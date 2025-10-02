'use client'

import React, { useState } from 'react'
import styles from './AlgLab2.module.css'
import { processSequence, validateSequence, generateUniqueSequence, DoubleLL } from '@/scripts/lab2/lab2script'

const AlgLab2 = () => {

    const [inputValue, setInputValue] = useState('');
    const [searchValue, setSearchValue] = useState('');
    const [originalList, setOriginalList] = useState(new DoubleLL());
    const [beforeList, setBeforeList] = useState(new DoubleLL());
    const [afterList, setAfterList] = useState(new DoubleLL());
    const [showResult, setShowResult] = useState(false);
    const [list] = useState(new DoubleLL());

//создание списка
    const handleGenerateList = () => {
        try {
            const randomList = generateUniqueSequence(8, 1, 50);
            
            //копируем элементы из сгенерированного списка в основной список
            list.clear();
            let current = randomList.head;
            while(current !== null){
                list.insertLast(current.value);
                current = current.next;
            }
            
            setOriginalList(copyList(list));
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

        setOriginalList(copyList(list));
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

            setOriginalList(copyList(list));
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

        setOriginalList(copyList(list));
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

        if (list.getLength() === 0){
            alert('Список пуст!');
            return;
        }

        try{
            const result = processSequence(list, c);

            setBeforeList(result.beforeReverse);
            setAfterList(result.after);
            setShowResult(true);
        } catch(error){
            alert('Ошибка: ' + error.message);
        }

    };

    const handleClearAll = () => {
        list.clear();
        setOriginalList(new DoubleLL());
        setBeforeList(new DoubleLL());
        setAfterList(new DoubleLL());
        setShowResult(false);
        setInputValue('');
        setSearchValue('');
    };

    //вспомогательная функция для копирования списка
    const copyList = (sourceList) => {
        const newList = new DoubleLL();
        let current = sourceList.head;
        while(current !== null){
            newList.insertLast(current.value);
            current = current.next;
        }
        return newList;
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
                    {!originalList.isEmpty() && (
                        <div className={styles.arrayInfo}>
                            <div className={styles.arrayDisplay}>
                                <strong>Исходная последовательность: </strong>{originalList.toString()}
                            </div>
                            <div>
                                <strong>Количество элементов: </strong>{originalList.getLength()}
                            </div>
                        </div>
                    )}

                    {showResult && (
                        <div className={styles.result}>
                            <span className={styles.resultext}>Результаты обработки</span>
                            <div className={styles.arrayInfo}>
                                <div className={styles.arrayDisplay}>
                                    <strong>Числа до {searchValue} (в обратном порядке): </strong><br />
                                    {!beforeList.isEmpty() ? beforeList.toString() : `Нет элементов`}
                                </div>
                                <div className={styles.arrayDisplay}>
                                    <strong>Числа после {searchValue} (в прямом порядке): </strong><br />
                                    {!afterList.isEmpty() ? afterList.toString() : `Нет элементов`}
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