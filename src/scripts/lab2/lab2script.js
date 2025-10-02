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

    //добавление элемента в конец списка
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

    //получение элементов до указанного значение в обратном порядке
    getBeforeReverse(targetValue){
        const resultList = new DoubleLL();
        let current = this.head;

        while (current !== null && current.value !== targetValue){
            //вставляем в начало для обратного порядка
            this.insertFirstInList(resultList, current.value);
            current = current.next;
        }

        return resultList;
    }

    //получение элементов после указанного значения
    getAfter(targetValue){
        const resultList = new DoubleLL();
        let current = this.head;
        let found = false;

        while(current !== null){
            if(found){
                resultList.insertLast(current.value);
            } else if(current.value === targetValue){
                found = true;
            }
            current = current.next;
        }
        return resultList;
    }

    //вспомогательный метод для вставки в начало (для обратного порядка)
    insertFirstInList(list, value){
        let node = new DoublLLNode(value);

        if (list.length === 0){
            list.head = node;
            list.tail = node;
        } else {
            node.next = list.head;
            list.head.prev = node;
            list.head = node;
        }

        list.length++;
        return node;
    }

    //преобразование в строку для вывода в интерфейс
    toString(){
        let result = '';
        let current = this.head;
        let first = true;

        while(current != null){
            if(!first){
                result += ', ';
            }
            result += current.value;
            current = current.next;
            first = false;
        }

        return `[${result}]`;
    }

    //получение длины списка
    getLength(){
        return this.length;
    }

    //проверка на пустоту
    isEmpty(){
        return this.length === 0;
    }

    //очистка списка
    clear(){
        this.head = null;
        this.tail = null;
        this.length = 0;
    }
}

//Функции

//основная функция программы
export const processSequence = (list, targetValue) => {
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

    const list = new DoubleLL();
    const used = new Set();

    while(list.getLength() < n){
        const randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
        if(!used.has(randomValue)){
            list.insertLast(randomValue);
            used.add(randomValue);
        }
    }
    return list;
};

//валидация последовательности
export const validateSequence = (list) => {
    const set = new Set();
    let current = list.head;

    while(current !== null){
        if(set.has(current.value)){
            throw new Error('Последовательность содержит повторяющиеся элементы');
        }
        set.add(current.value);
        current = current.next;
    }
    return true;
}

export {DoubleLL};