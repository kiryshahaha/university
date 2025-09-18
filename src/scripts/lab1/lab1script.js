export const generateArray = (n) => {
        if (n <= 0) {
        alert('Размер массива должен быть положительным!');
        return
    }

    const maxR = Math.floor(n / 2);
    const minR = -(maxR - 1);

    const newArray = [];
    let evenCounter = 0;

    for (let i = 0; i < n; i++) {
        const randomValue = Math.floor(Math.random() * (maxR - minR + 1)) + minR;
        newArray.push(randomValue);

        if (randomValue % 2 === 0) {
            evenCounter++;
        }
    }

    return {
        array: newArray,
        minRange: minR,
        maxRange: maxR,
        evenCount: evenCounter
    };
};

export const calculateNegativeSum = (array) => {
    let sum = 0;
    let operations = 0;

    for (let i = 0; i < array.length; i++) {
        operations++;
        if (array[i] < 0) {
            sum += array[i];
        }
    }

    return {
        sum,
        operations,
        complexity: 'O(n)'
    };
};

export const getEvenCount = (evenCount) => {
    return {
        count: evenCount,
        operations: 1,
        complexity: 'O(1)'
    };
};