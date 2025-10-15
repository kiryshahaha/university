/**
 * статический стек 
 */
export class StaticStack {
  constructor(maxSize) {
    this.maxSize = maxSize;
    this.stack = [];
  }

  push(value) {
    if (this.isFull()) {
      return false; // Нельзя добавить, стек полный
    }
    this.stack.push(value);
    return true;
  }

  pop() {
    return this.stack.pop();
  }

  peek() {
    return this.stack.at(-1);
  }

  size() {
    return this.stack.length;
  }

  isEmpty() {
    return this.stack.length === 0;
  }

  isFull() {
    return this.stack.length >= this.maxSize;
  }

  clear() {
    this.stack = [];
  }
}

/**
 * динамическая очередь 
 */
export class DynamicQueue {
  constructor() {
    this.queue = [];
  }

  enqueue(value) {
    this.queue.push(value);
    return this.queue;
  }

  dequeue() {
    return this.queue.shift();
  }

  peek() {
    return this.queue[0];
  }

  isEmpty() {
    return this.queue.length === 0;
  }

  size() {
    return this.queue.length;
  }

  clear() {
    this.queue = [];
  }
}

export class Task {
  static nextId = 1;
  constructor(priority, duration) {
    this.id = Task.nextId++; //уникальный id для каждой задачи (для визуализации фифы)
    this.priority = priority; // 0 (F0), 1 (F1), 2 (F2)
    this.duration = duration; // время выполнения в тактах
    this.remainingTime = duration; //оставшееся время
    this.arrivalTime = 0; // время поступления
  }
}

export class Processor {
  constructor(name) {
    this.name = name;
    this.currentTask = null; //текущая задача (если свободен - null)
    this.isInterrupted = false; //флаг прерывания
  }

  isFree() {
    return this.currentTask === null; //проверка на простой
  }

  assignTask(task) {
    this.currentTask = task; //назначаем задачу 
    this.isInterrupted = false; //сбрасываем флаг прерывания
  }

  interrupt() {
    if (this.currentTask && !this.isInterrupted) {
      this.isInterrupted = true;
      return this.currentTask;
    }
    return null;
  }

  tick() {
    if (!this.currentTask) {
      return null; //нет задачи - ничего не происходит 
    }

    this.currentTask.remainingTime--; //--время
    
    if (this.currentTask.remainingTime <= 0) {
      const completedTask = this.currentTask;
      this.currentTask = null;
      this.isInterrupted = false;
      return completedTask;
    }
    
    return null;
  }

  clear() {
    this.currentTask = null;
    this.isInterrupted = false;
  }
}

export class SystemModel {
  constructor(stackSize = 1) {
    this.processor = new Processor("P");
    this.queues = [
      new DynamicQueue(), // F0 (высший приоритет)
      new DynamicQueue(), // F1 (средний приоритет)
      new DynamicQueue()  // F2 (низший приоритет)
    ];
    this.stack = new StaticStack(stackSize);
    this.time = 0;
    this.completedTasks = [];
  }

  addTask(priority, duration) {
    const task = new Task(priority, duration);
    task.arrivalTime = this.time; //время поступления
    this.queues[priority].enqueue(task); //добавляем в очередь по приоритету
    return task;
  }

  addRandomTask() {
    const priority = Math.floor(Math.random() * 3); // 0, 1 или 2
    const duration = Math.floor(Math.random() * 5) + 1; // 1-5 тактов
    return this.addTask(priority, duration);
  }

  executeTick() {
    this.time++; //1 такт времени
    
    // обработка прерываний - проверяем, есть ли задачи с более высоким приоритетом
    if (!this.processor.isFree()) {
      const currentPriority = this.processor.currentTask.priority;
      
      // ищем задачу с более высоким приоритетом (с меньшим номером)
      for (let i = 0; i < currentPriority; i++) {
        //нашли
        if (!this.queues[i].isEmpty()) {
          // прерываем текущую задачу и помещаем в стек
          const interruptedTask = this.processor.interrupt();
          if (interruptedTask && this.stack.push(interruptedTask)) {
            // берем задачу с более высоким приоритетом
            const highPriorityTask = this.queues[i].dequeue();
            this.processor.assignTask(highPriorityTask);
          }
          break;
        }
      }
    }

    // если процессор свободен - ищем задачу в очередях по приоритету
    if (this.processor.isFree()) {
      for (let i = 0; i < 3; i++) {
        if (!this.queues[i].isEmpty()) {
          const task = this.queues[i].dequeue();
          this.processor.assignTask(task);
          break; //только первая найденная (если в F1 нашли - в F2 не проверяем)
        }
      }
    }

    // такт процессора
    const completedTask = this.processor.tick();
    if (completedTask) {
      this.completedTasks.push(completedTask);
    }

    // если процессор свободен - достаем задачу из стека
    if (this.processor.isFree() && !this.stack.isEmpty()) {
      const taskFromStack = this.stack.pop();
      this.processor.assignTask(taskFromStack);
    }

    return {
      time: this.time,
      processor: this.processor.currentTask,
      queues: this.queues.map(queue => [...queue.queue]),
      stack: [...this.stack.stack],
      completed: this.completedTasks.length
    };
  }

  reset() {
    this.processor.clear();
    this.queues.forEach(queue => queue.clear());
    this.stack.clear();
    this.time = 0;
    this.completedTasks = [];
  }

  getState() {
    return {
      time: this.time,
      processor: this.processor.currentTask,
      queues: this.queues.map(queue => [...queue.queue]),
      stack: [...this.stack.stack],
      completed: this.completedTasks.length,
      isProcessorInterrupted: this.processor.isInterrupted
    };
  }
}