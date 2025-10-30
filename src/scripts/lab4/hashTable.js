export class HashTable {
  constructor(segments = 1500) {
    this.segments = segments;
    this.table = Array(segments).fill(null);
    this.elementCount = 0;
    this.MAX_CHAIN_LENGTH = 50;
  }

  // Валидация формата ключа: БццццБ
  validateKey(key) {
    if (key.length !== 6) return false;
    
    const pattern = /^[A-Z][0-9]{4}[A-Z]$/;
    return pattern.test(key);
  }

  // Хеш-функция (улучшенная для равномерного распределения)
  calculateHash(key) {
    if (!this.validateKey(key)) {
      throw new Error('Неверный формат ключа. Ожидается: БццццБ (Б-буква, ц-цифра)');
    }
    
    let hash = 0;
    const prime1 = 31;
    const prime2 = 17;
    
    for (let i = 0; i < key.length; i++) {
      hash = (hash * prime1 + key.charCodeAt(i) * prime2) % this.segments;
    }
    
    return hash;
  }

  // Добавление элемента с проверкой переполнения
  add(key, value) {
    if (!this.validateKey(key)) {
      throw new Error('Неверный формат ключа. Ожидается: БццццБ');
    }
    
    const hash = this.calculateHash(key);
    let currentNode = this.table[hash];
    let chainLength = 0;

    // Проверка существования ключа и подсчет длины цепочки
    while (currentNode !== null) {
      chainLength++;
      if (currentNode.key === key) {
        // Обновление существующего элемента
        currentNode.value = value;
        return { key, hash, operation: 'updated' };
      }
      currentNode = currentNode.next;
    }

    // Проверка переполнения
    if (chainLength >= this.MAX_CHAIN_LENGTH) {
      throw new Error(`Переполнение сегмента ${hash}. Максимальная длина цепочки: ${this.MAX_CHAIN_LENGTH}`);
    }

    // Добавление нового элемента в начало списка
    const newNode = new Node(key, value, this.table[hash]);
    this.table[hash] = newNode;
    this.elementCount++;
    return { key, hash, operation: 'added' };
  }

  // Поиск по ключу
  searchByKey(key) {
    if (!this.validateKey(key)) {
      throw new Error('Неверный формат ключа');
    }
    
    const hash = this.calculateHash(key);
    let currentNode = this.table[hash];
    const foundItems = [];

    while (currentNode !== null) {
      if (currentNode.key === key) {
        foundItems.push({ key: currentNode.key, value: currentNode.value });
      }
      currentNode = currentNode.next;
    }

    return {
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
    
    const items = [];
    let currentNode = this.table[segmentIndex];
    
    while (currentNode !== null) {
      items.push({ key: currentNode.key, value: currentNode.value });
      currentNode = currentNode.next;
    }
    
    return {
      segment: segmentIndex,
      items: items,
      count: items.length
    };
  }

  // Удаление с поиском коллизий
  remove(key) {
    if (!this.validateKey(key)) {
      throw new Error('Неверный формат ключа');
    }
    
    const hash = this.calculateHash(key);
    let currentNode = this.table[hash];
    let prevNode = null;
    let removedCount = 0;

    while (currentNode !== null) {
      if (currentNode.key === key) {
        // Удаление узла
        if (prevNode === null) {
          // Удаление первого узла
          this.table[hash] = currentNode.next;
        } else {
          prevNode.next = currentNode.next;
        }
        removedCount++;
        this.elementCount--;
      } else {
        prevNode = currentNode;
      }
      currentNode = currentNode.next;
    }

    // Получаем оставшиеся элементы после удаления
    const remainingItems = [];
    let remainingNode = this.table[hash];
    while (remainingNode !== null) {
      remainingItems.push({ key: remainingNode.key, value: remainingNode.value });
      remainingNode = remainingNode.next;
    }

    return {
      key,
      hash,
      removed: removedCount,
      remainingItems: remainingItems,
      remainingCount: remainingItems.length
    };
  }

  // Генерация случайного ключа заданного формата (для тестов)
  generateRandomKey() {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    
    const randomLetter = () => letters[Math.floor(Math.random() * letters.length)];
    const randomDigit = () => numbers[Math.floor(Math.random() * numbers.length)];
    
    return randomLetter() + 
           randomDigit() + randomDigit() + randomDigit() + randomDigit() + 
           randomLetter();
  }

  // Массовое добавление с контролем переполнения
  bulkAdd(count) {
    let added = 0;
    let updated = 0;
    const errors = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const key = this.generateRandomKey();
        const value = `value_${i}`;
        const result = this.add(key, value);
        
        if (result.operation === 'added') added++;
        else if (result.operation === 'updated') updated++;
      } catch (error) {
        errors.push(error.message);
        // При переполнении прекращаем добавление
        if (error.message.includes('Переполнение')) {
          break;
        }
      }
    }
    
    return { added, updated, errors };
  }

  generateKeyFromText(text) {
    const strData = String(text);
    let hash = 0;
    
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
    
    const generatedKey = firstLetter + fourDigits + lastLetter;
    
    if (!this.validateKey(generatedKey)) {
      throw new Error('Ошибка генерации ключа');
    }
    
    return generatedKey;
  }

  // Получение статистики
  getStatistics() {
    let usedSegments = 0;
    let maxChainLength = 0;
    const chainDistribution = {};

    // Инициализация распределения цепочек
    for (let i = 0; i <= this.MAX_CHAIN_LENGTH; i++) {
      chainDistribution[i] = 0;
    }

    // Обход всех сегментов для сбора статистики
    for (let i = 0; i < this.segments; i++) {
      let chainLength = 0;
      let currentNode = this.table[i];

      // Подсчет длины цепочки для текущего сегмента
      while (currentNode !== null) {
        chainLength++;
        currentNode = currentNode.next;
      }

      // Обновление статистики
      if (chainLength > 0) {
        usedSegments++;
      }
      if (chainLength > maxChainLength) {
        maxChainLength = chainLength;
      }
      chainDistribution[chainLength]++;
    }

    const emptySegments = this.segments - usedSegments;

    return {
      totalElements: this.elementCount,
      usedSegments,
      emptySegments,
      maxChainLength,
      loadFactor: ((usedSegments / this.segments) * 100).toFixed(1),
      totalSegments: this.segments,
      chainDistribution,
      overflowSegments: chainDistribution[this.MAX_CHAIN_LENGTH] || 0
    };
  }

  // Экспорт для гистограммы (только длины цепочек)
  exportForHistogram() {
    const data = [];
    
    for (let i = 0; i < this.segments; i++) {
      let chainLength = 0;
      let currentNode = this.table[i];
      
      while (currentNode !== null) {
        chainLength++;
        currentNode = currentNode.next;
      }
      
      data.push({
        segment: i,
        chainLength: chainLength
      });
    }
    
    const csv = 'Segment;ChainLength\n' + 
                data.map(item => `${item.segment};${item.chainLength}`).join('\n');
    
    return csv;
  }

  reset() {
    this.table = Array(this.segments).fill(null);
    this.elementCount = 0;
  }

  getAllItems(limit = 20) {
    const items = [];
    for (let i = 0; i < Math.min(this.table.length, limit); i++) {
      const segmentItems = [];
      let currentNode = this.table[i];
      
      while (currentNode !== null) {
        segmentItems.push({ key: currentNode.key, value: currentNode.value });
        currentNode = currentNode.next;
      }
      
      items.push({
        segment: i,
        items: segmentItems,
        count: segmentItems.length
      });
    }
    return items;
  }
}

// Вспомогательный класс для узла связного списка
class Node {
  constructor(key, value, next = null) {
    this.key = key;
    this.value = value;
    this.next = next;
  }
}

export const createHashTable = (segments = 1500) => new HashTable(segments);  