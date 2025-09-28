//двусвязный список
class DoublLLNode {
    constructor(value) {
        this.value = value;
        this.prev = null;
        this.next = null;
    }
}

class DoubleLL {
    constructor(){
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    //добавление элемента в концел листа
    insertLast(value){
        let node = new DoublLLNode(value);

        if (this.length === 0){
            this.head = node;
            this.tail = node;
        } else {
            node.prev = this.tail;
            this.tail.next = node;
            this.tail = node;
        }

        this.length++;
        return node;
    }

    //удаление элемента
    removeElement(value){
        let current = this.head;

        while(current != null){
            if(current.value === value){
                //удаление единственного элемента
                if (this.length === 1){
                    this.head = null;
                    this.tail = null;
                }
                //удаление головы
                else if(current === this.head){
                    this.head = this.head.next;
                    this.head.prev = null;
                }
                //удаление хвоста
                else if(current === this.tail){
                    this.tail = this.tail.prev;
                    this.tail.next = null;
                }
                //удаление из середины
                else{
                    current.prev.next = current.next;
                    current.next.prev = current.prev;
                }

                this.length--;
                return true;
            }
            current = current.next;
        }
        return false;
    }

    //поиск элемента
    findElement(value){
        let current = this.head;

        while(current !== null){
            if(current.value == value){
                return current;
            }
            current = current.next;
        }
        return null;
    }

    //преобразования в массив для вывода
    toArray(){
        const result = [];
        let current = this.head;

        while(current != null){
            result.push(current.value);
            current = current.next
        }

        return result
    }

    //получение элементов до указанного значение в обратном порядке
    getBeforeReverse(targetValue){
        const result = [];
        let current = this.head;

        while (current !== null && current.value !== targetValue){
            result.push(current.value);
            current = current.next;
        }

        return result.reverse();
    }

    //получение элементов после указанного значения
    getAfter(targetValue){
        const result = [];
        let current = this.head;
        let found = false;

        while(current !== null){
            if(found){
                result.push(current.value);
            } else if(current.value === targetValue){
                found = true
            }
            current = current.next;
        }
        return result;
    }

    getIndex(value){
        let current = this.head;
        let index = 0;

        while(current !== null){
            if(current.value === value){
                return index;
            }
            current = current.next;
            index++;
        }
        return -1;
    }

    clear(){
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
}

//Функции

//основная функция программы
export const processSequence = (sequence, targetValue) => {
    const list = new DoubleLL();

    sequence.forEach(value => list.insertLast(value));

    if(list.findElement(targetValue) === null){
        throw new Error(`Число ${targetValue} не найдено в последовательности`);
    };

    const beforeReverse = list.getBeforeReverse(targetValue);
    const after = list.getAfter(targetValue);

    return{
        beforeReverse,
        after
    };
};

//случайная последовательность
export const generateUniqueSequence = (n, min = 1, max = 100) => {
    if (n > (max-min + 1)){
        throw new Error(`Невозможно создать последовательность: диапазон слишком мал`);
    }

    const sequence = [];
    const used = new Set();

    while(sequence.length < n){
        const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
        if(!used.has(randomValue)){
            sequence.push(randomValue);
            used.add(randomValue);
        }
    }
    return sequence;
};

//валидация последовательности
export const validateSequence = (sequence) => {
    const set = new Set(sequence);
    if (set.size !== sequence.length){
        throw new Error('Последователоность содержит повторяющиеся элементы');
    }
    return true;
}

export {DoubleLL};
