export class HashTable {
  constructor(segments = 1500) {
    this.segments = segments;
    this.table = Array(segments).fill(null).map(() => []);
    this.elementCount = 0;
  }

  // Генерация ключа формата БццццБ из произвольных данных
  generateKey(data) {
    const strData = String(data);
    let hash = 0;
    
    // Вычисляем хеш от данных для детерминированности
    for (let i = 0; i < strData.length; i++) {
      hash = ((hash << 5) - hash) + strData.charCodeAt(i);
      hash |= 0;
    }
    
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const absHash = Math.abs(hash);
    
    // Первая буква
    const firstLetter = letters[absHash % letters.length];
    
    // 4 цифры
    let fourDigits = '';
    for (let i = 0; i < 4; i++) {
      const digitIndex = ((absHash * (i + 1) * 7) % numbers.length);
      fourDigits += numbers[digitIndex];
    }
    
    // Последняя буква
    const lastLetterIndex = ((absHash * 17) % letters.length);
    const lastLetter = letters[lastLetterIndex];
    
    return firstLetter + fourDigits + lastLetter;
  }

  // Хеш-функция для вычисления индекса сегмента
  calculateHash(key) {
    let hash = 0;
    const prime = 31;
    
    for (let i = 0; i < key.length; i++) {
      hash = (hash * prime + key.charCodeAt(i)) % this.segments;
    }
    
    return hash;
  }

  // Добавление данных в хеш-таблицу
  add(data) {
    const key = this.generateKey(data);
    const hash = this.calculateHash(key);
    
    // Проверяем, нет ли уже таких данных в цепочке
    const existingIndex = this.table[hash].findIndex(item => item.key === key && item.originalData === data);
    
    if (existingIndex !== -1) {
      // Элемент уже существует
      return { key, hash, operation: 'exists', data };
    } else {
      // Добавляем новый элемент
      this.table[hash].push({ originalData: data, key, hash });
      this.elementCount++;
      return { key, hash, operation: 'added', data };
    }
  }

  // Поиск по данным
  searchByData(data) {
    const key = this.generateKey(data);
    const hash = this.calculateHash(key);
    const segment = this.table[hash];
    
    const foundItems = segment.filter(item => item.key === key && item.originalData === data);
    return {
      data,
      key,
      hash,
      found: foundItems,
      count: foundItems.length
    };
  }

  // Поиск по сегменту
  searchBySegment(segmentIndex) {
    if (segmentIndex < 0 || segmentIndex >= this.segments) {
      throw new Error(`Неверный индекс сегмента: ${segmentIndex}`);
    }
    
    return {
      segment: segmentIndex,
      items: [...this.table[segmentIndex]], // возвращаем копию
      count: this.table[segmentIndex].length
    };
  }

  // Удаление данных
  remove(data) {
    const key = this.generateKey(data);
    const hash = this.calculateHash(key);
    const segment = this.table[hash];
    
    const initialLength = segment.length;
    this.table[hash] = segment.filter(item => !(item.key === key && item.originalData === data));
    const removedCount = initialLength - this.table[hash].length;
    
    if (removedCount > 0) {
      this.elementCount -= removedCount;
    }
    
    return {
      data,
      key,
      hash,
      removed: removedCount
    };
  }

  // Получение статистики
  getStatistics() {
    const usedSegments = this.table.filter(segment => segment.length > 0).length;
    const maxChainLength = Math.max(...this.table.map(segment => segment.length));
    const emptySegments = this.segments - usedSegments;
    
    return {
      totalElements: this.elementCount,
      usedSegments,
      emptySegments,
      maxChainLength: maxChainLength > -Infinity ? maxChainLength : 0,
      loadFactor: (usedSegments / this.segments * 100).toFixed(1),
      totalSegments: this.segments
    };
  }

  // Экспорт данных для CSV
  exportToCSV() {
    const headers = 'Сегмент,Количество_элементов,Элементы\n';
    const data = this.table.map((segment, index) => {
      const items = segment.map(item => `"${item.originalData}"`).join(';');
      return `${index},${segment.length},"${items}"`;
    }).join('\n');
    
    return headers + data;
  }

  // Импорт данных (простая реализация)
  importFromCSV(csvData) {
    // В реальной реализации здесь будет парсинг CSV
    // Пока просто сбрасываем таблицу
    this.reset();
    return { imported: 0 }; // заглушка
  }

  // Сброс таблицы
  reset() {
    this.table = Array(this.segments).fill(null).map(() => []);
    this.elementCount = 0;
  }

  // Получение всех элементов (для отображения)
  getAllItems(limit = 20) {
    const items = [];
    for (let i = 0; i < Math.min(this.table.length, limit); i++) {
      items.push({
        segment: i,
        items: [...this.table[i]], // возвращаем копию
        count: this.table[i].length
      });
    }
    return items;
  }

  // Метод для получения состояния (для React)
  getState() {
    return {
      table: this.table.map(segment => [...segment]), // глубокая копия
      elementCount: this.elementCount,
      segments: this.segments
    };
  }
}

// Создание и экспорт экземпляра по умолчанию
export const createHashTable = (segments = 1500) => new HashTable(segments);