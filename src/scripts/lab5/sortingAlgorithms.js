// Алгоритмы сортировки и вспомогательные функции для лабораторной работы 5

/**
 * Чётно-нечётная сортировка с подсчётом операций
 * @param {Array} arr - массив для сортировки
 * @returns {Object} - результат сортировки со статистикой
 */
export function oddEvenSort(arr) {
    const n = arr.length;
    let comparisons = 0;
    let swaps = 0;
    
    // Создаем копию массива чтобы не мутировать оригинал
    const sortedArray = [...arr];
    let isSorted = false;
    
    while (!isSorted) {
        isSorted = true;
        
        // Нечётная фаза (элементы с нечётными индексами: 1-2, 3-4, ...)
        for (let i = 1; i < n - 1; i += 2) {
            comparisons++;
            if (sortedArray[i] > sortedArray[i + 1]) {
                // Обмен элементов
                [sortedArray[i], sortedArray[i + 1]] = [sortedArray[i + 1], sortedArray[i]];
                swaps++;
                isSorted = false;
            }
        }
        
        // Чётная фаза (элементы с чётными индексами: 0-1, 2-3, ...)
        for (let i = 0; i < n - 1; i += 2) {
            comparisons++;
            if (sortedArray[i] > sortedArray[i + 1]) {
                // Обмен элементов
                [sortedArray[i], sortedArray[i + 1]] = [sortedArray[i + 1], sortedArray[i]];
                swaps++;
                isSorted = false;
            }
        }
    }
    
    return {
        sortedArray,
        comparisons,
        swaps
    };
}

/**
 * Подсчёт количества уникальных чисел в отсортированном массиве
 * @param {Array} sortedArr - отсортированный массив
 * @returns {Object} - результат с количеством уникальных чисел и сравнениями
 */
export function countUniqueNumbers(sortedArr) {
    if (sortedArr.length === 0) {
        return {
            uniqueCount: 0,
            comparisons: 0
        };
    }
    
    let uniqueCount = 1; // Первый элемент всегда уникальный
    let comparisons = 0;
    
    for (let i = 1; i < sortedArr.length; i++) {
        comparisons++;
        if (sortedArr[i] !== sortedArr[i - 1]) {
            uniqueCount++;
        }
    }
    
    return {
        uniqueCount,
        comparisons
    };
}

/**
 * Добавление элемента в массив с последующей сортировкой
 * @param {Array} arr - исходный массив
 * @param {number} value - значение для добавления
 * @returns {Object} - результат добавления
 */
export function addElement(arr, value) {
    const newArray = [...arr, value];
    const sortResult = oddEvenSort(newArray);
    const uniqueResult = countUniqueNumbers(sortResult.sortedArray);
    
    return {
        newArray: sortResult.sortedArray,
        addedValue: value,
        sortStats: sortResult,
        uniqueStats: uniqueResult
    };
}

/**
 * Удаление элемента из массива по значению
 * @param {Array} arr - исходный массив
 * @param {number} value - значение для удаления
 * @returns {Object} - результат удаления
 */
export function removeElement(arr, value) {
    const newArray = arr.filter(item => item !== value);
    const sortResult = oddEvenSort(newArray);
    const uniqueResult = countUniqueNumbers(sortResult.sortedArray);
    
    return {
        newArray: sortResult.sortedArray,
        removedValue: value,
        removedCount: arr.length - newArray.length,
        sortStats: sortResult,
        uniqueStats: uniqueResult
    };
}

/**
 * Очистка массива
 * @returns {Object} - результат очистки
 */
export function clearArray() {
    return {
        newArray: [],
        sortStats: {
            comparisons: 0,
            swaps: 0
        },
        uniqueStats: {
            uniqueCount: 0,
            comparisons: 0
        }
    };
}

/**
 * Генерация случайного массива
 * @param {number} size - размер массива
 * @param {number} min - минимальное значение
 * @param {number} max - максимальное значение
 * @returns {Array} - сгенерированный массив
 */
export function generateRandomArray(size = 20, min = 1, max = 100) {
    return Array.from({ length: size }, () => 
        Math.floor(Math.random() * (max - min + 1)) + min
    );
}

/**
 * Парсинг строки в массив чисел
 * @param {string} input - строка с числами через запятую
 * @returns {Object} - результат парсинга
 */
export function parseArrayInput(input) {
    try {
        const numbers = input.split(',').map(item => {
            const num = parseInt(item.trim());
            if (isNaN(num)) {
                throw new Error(`Некорректное число: "${item}"`);
            }
            return num;
        });
        
        return {
            success: true,
            array: numbers,
            length: numbers.length
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
            array: []
        };
    }
}

/**
 * Основная функция для выполнения задания варианта 6
 * @param {Array} array - исходный массив
 * @returns {Object} - полные результаты выполнения
 */
export function executeVariant6(array) {
    if (!array || array.length === 0) {
        return {
            success: false,
            error: 'Массив пуст'
        };
    }
    
    // Выполняем сортировку
    const sortResult = oddEvenSort(array);
    
    // Подсчитываем уникальные числа
    const uniqueResult = countUniqueNumbers(sortResult.sortedArray);
    
    return {
        success: true,
        originalArray: [...array],
        sortedArray: sortResult.sortedArray,
        sortStats: sortResult,
        uniqueStats: uniqueResult,
        summary: {
            totalElements: array.length,
            uniqueElements: uniqueResult.uniqueCount,
            totalComparisons: sortResult.comparisons + uniqueResult.comparisons,
            totalSwaps: sortResult.swaps
        }
    };
}

// Экспорт всех функций
export default {
    oddEvenSort,
    countUniqueNumbers,
    addElement,
    removeElement,
    clearArray,
    generateRandomArray,
    parseArrayInput,
    executeVariant6
};