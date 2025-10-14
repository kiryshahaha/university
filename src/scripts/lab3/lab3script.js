// Класс задачи
class Task {
    constructor(id, arrivalTime, priority, duration) {
        this.id = id;
        this.arrivalTime = arrivalTime;
        this.priority = priority; // 0 - высший, 1 - средний, 2 - низший
        this.duration = duration;
        this.remainingTime = duration;
        this.startTime = null;
        this.endTime = null;
    }
}

// Статический стек (фиксированного размера)
class StaticStack {
    constructor(size) {
        this.size = size;
        this.items = Array(size).fill(null);
        this.top = -1;
    }

    push(task) {
        if (this.isFull()) {
            throw new Error("Stack overflow: невозможно сохранить прерванную задачу");
        }
        this.top++;
        this.items[this.top] = task;
        return true;
    }

    pop() {
        if (this.isEmpty()) {
            return null;
        }
        const task = this.items[this.top];
        this.items[this.top] = null;
        this.top--;
        return task;
    }

    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.items[this.top];
    }

    isEmpty() {
        return this.top === -1;
    }

    isFull() {
        return this.top === this.size - 1;
    }

    toString() {
        if (this.isEmpty()) return "Empty";
        return `[${this.items.slice(0, this.top + 1).map(task => task.id).join(", ")}]`;
    }
}

// Динамическая очередь (на основе связного списка)
class QueueNode {
    constructor(task) {
        this.task = task;
        this.next = null;
    }
}

class DynamicQueue {
    constructor() {
        this.head = null;
        this.tail = null;
        this.length = 0;
    }

    enqueue(task) {
        const newNode = new QueueNode(task);
        
        if (this.isEmpty()) {
            this.head = newNode;
            this.tail = newNode;
        } else {
            this.tail.next = newNode;
            this.tail = newNode;
        }
        this.length++;
        return true;
    }

    dequeue() {
        if (this.isEmpty()) {
            return null;
        }
        
        const task = this.head.task;
        this.head = this.head.next;
        
        if (this.head === null) {
            this.tail = null;
        }
        
        this.length--;
        return task;
    }

    peek() {
        if (this.isEmpty()) {
            return null;
        }
        return this.head.task;
    }

    isEmpty() {
        return this.head === null;
    }

    toString() {
        if (this.isEmpty()) return "Empty";
        
        let result = "";
        let current = this.head;
        let first = true;
        
        while (current !== null) {
            if (!first) {
                result += ", ";
            }
            result += current.task.id;
            current = current.next;
            first = false;
        }
        
        return `[${result}]`;
    }

    getLength() {
        return this.length;
    }
}

// Основной класс системы
class SystemModel {
    constructor(stackSize = 1) {
        this.processor = null;
        this.stack = new StaticStack(stackSize);
        this.queues = [new DynamicQueue(), new DynamicQueue(), new DynamicQueue()]; // F0, F1, F2
        this.time = 0;
        this.completedTasks = [];
        this.taskIdCounter = 1;
    }

    // Добавление задачи
    addTask(arrivalTime, priority, duration) {
        const task = new Task(this.taskIdCounter++, arrivalTime, priority, duration);
        return task;
    }

    // Получить задачу для выполнения (согласно приоритету)
    getNextTask() {
        for (let i = 0; i < 3; i++) {
            if (!this.queues[i].isEmpty()) {
                return this.queues[i].dequeue();
            }
        }
        return null;
    }

    // Проверить, есть ли задачи с более высоким приоритетом
    hasHigherPriorityTask(currentPriority) {
        for (let i = 0; i < currentPriority; i++) {
            if (!this.queues[i].isEmpty()) {
                return true;
            }
        }
        return false;
    }

    // Выполнить один такт системы
    executeTick() {
        const state = {
            time: this.time,
            processor: this.processor,
            stack: this.stack.toString(),
            queues: this.queues.map(queue => queue.toString()),
            completedTasks: [...this.completedTasks],
            events: []
        };

        // 1. Проверка прерывания
        if (this.processor !== null) {
            const currentPriority = this.processor.priority;
            
            if (this.hasHigherPriorityTask(currentPriority)) {
                if (!this.stack.isFull()) {
                    // Прерываем текущую задачу
                    state.events.push(`Задача ${this.processor.id} прервана и помещена в стек`);
                    this.stack.push(this.processor);
                    this.processor = null;
                } else {
                    state.events.push(`Невозможно прервать задачу ${this.processor.id} - стек переполнен`);
                }
            }
        }

        // 2. Если процессор свободен - занять его
        if (this.processor === null) {
            // Сначала проверяем стек
            if (!this.stack.isEmpty()) {
                this.processor = this.stack.pop();
                state.events.push(`Задача ${this.processor.id} восстановлена из стека`);
            } else {
                // Ищем задачу в очередях
                const nextTask = this.getNextTask();
                if (nextTask !== null) {
                    this.processor = nextTask;
                    state.events.push(`Задача ${this.processor.id} начала выполнение`);
                }
            }
        }

        // 3. Выполнение текущей задачи
        if (this.processor !== null) {
            this.processor.remainingTime--;
            
            if (this.processor.remainingTime === 0) {
                this.processor.endTime = this.time;
                this.completedTasks.push(this.processor);
                state.events.push(`Задача ${this.processor.id} завершена`);
                this.processor = null;
            }
        }

        this.time++;
        return state;
    }

    // Добавить задачу в соответствующую очередь
    addTaskToQueue(task) {
        if (task.priority >= 0 && task.priority <= 2) {
            this.queues[task.priority].enqueue(task);
            return true;
        }
        return false;
    }

    // Получить текущее состояние системы
getSystemState() {
    return {
        time: this.time,
        processor: this.processor ? `Задача ${this.processor.id}` : "Free", // Всегда возвращаем строку
        stack: this.stack.toString(),
        queues: {
            F0: this.queues[0].toString(),
            F1: this.queues[1].toString(),
            F2: this.queues[2].toString()
        },
        completedTasks: this.completedTasks.length
    };
}

    // Автоматический генератор задач
    generateRandomTask() {
        const priority = Math.floor(Math.random() * 3);
        const duration = Math.floor(Math.random() * 5) + 1; // 1-5 тактов
        const task = this.addTask(this.time, priority, duration);
        this.addTaskToQueue(task);
        return task;
    }

    // Сброс системы
    reset() {
        this.processor = null;
        this.stack = new StaticStack(this.stack.size);
        this.queues = [new DynamicQueue(), new DynamicQueue(), new DynamicQueue()];
        this.time = 0;
        this.completedTasks = [];
        this.taskIdCounter = 1;
    }
}

// Экспорты
export { Task, StaticStack, DynamicQueue, SystemModel };