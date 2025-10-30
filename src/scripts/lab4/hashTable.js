export class HashTable {
  constructor(segments = 1500) {
    this.segments = segments;
    this.table = Array(segments).fill(null).map(() => []);
    this.elementCount = 0;
    this.MAX_CHAIN_LENGTH = 5; // Максимальная длина цепочки для контроля переполнения
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
    const segment = this.table[hash];
    
    // Проверка переполнения
    if (segment.length >= this.MAX_CHAIN_LENGTH) {
      throw new Error(`Переполнение сегмента ${hash}. Максимальная длина цепочки: ${this.MAX_CHAIN_LENGTH}`);
    }
    
    // Проверка существования ключа
    const existingIndex = segment.findIndex(item => item.key === key);
    if (existingIndex !== -1) {
      // Обновление существующего элемента
      segment[existingIndex].value = value;
      return { key, hash, operation: 'updated' };
    } else {
      // Добавление нового элемента
      segment.push({ key, value });
      this.elementCount++;
      return { key, hash, operation: 'added' };
    }
  }

  // Поиск по ключу
  searchByKey(key) {
    if (!this.validateKey(key)) {
      throw new Error('Неверный формат ключа');
    }
    
    const hash = this.calculateHash(key);
    const segment = this.table[hash];
    
    const foundItems = segment.filter(item => item.key === key);
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
    
    return {
      segment: segmentIndex,
      items: [...this.table[segmentIndex]],
      count: this.table[segmentIndex].length
    };
  }

  // Удаление с поиском коллизий
  remove(key) {
    if (!this.validateKey(key)) {
      throw new Error('Неверный формат ключа');
    }
    
    const hash = this.calculateHash(key);
    const segment = this.table[hash];
    
    const initialLength = segment.length;
    this.table[hash] = segment.filter(item => item.key !== key);
    const removedCount = initialLength - this.table[hash].length;
    
    if (removedCount > 0) {
      this.elementCount -= removedCount;
      
      // Возвращаем информацию об оставшихся элементах (коллизиях)
      const remainingItems = this.table[hash];
      return {
        key,
        hash,
        removed: removedCount,
        remainingItems: remainingItems,
        remainingCount: remainingItems.length
      };
    }
    
    return {
      key,
      hash,
      removed: 0,
      remainingItems: [],
      remainingCount: 0
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
  
  const generatedKey = firstLetter + fourDigits + lastLetter;
  
  // Проверяем, что сгенерированный ключ соответствует формату
  if (!this.validateKey(generatedKey)) {
    throw new Error('Ошибка генерации ключа');
  }
  
  return generatedKey;
}

  // Получение статистики
  getStatistics() {
    const segmentLengths = this.table.map(segment => segment.length);
    const usedSegments = segmentLengths.filter(length => length > 0).length;
    const maxChainLength = Math.max(...segmentLengths);
    const emptySegments = this.segments - usedSegments;
    
    // Распределение по длинам цепочек
    const chainDistribution = {};
    for (let i = 0; i <= this.MAX_CHAIN_LENGTH; i++) {
      chainDistribution[i] = segmentLengths.filter(len => len === i).length;
    }
    
    return {
      totalElements: this.elementCount,
      usedSegments,
      emptySegments,
      maxChainLength: maxChainLength > -Infinity ? maxChainLength : 0,
      loadFactor: ((usedSegments / this.segments) * 100).toFixed(1),
      totalSegments: this.segments,
      chainDistribution,
      overflowSegments: chainDistribution[this.MAX_CHAIN_LENGTH] || 0
    };
  }

  // Экспорт для гистограммы (только длины цепочек)
exportForHistogram() {
  const data = this.table.map((segment, index) => ({
    segment: index,
    chainLength: segment.length
  }));
  
  // Используем точку с запятой как разделитель
  const csv = 'Segment;ChainLength\n' + 
              data.map(item => `${item.segment};${item.chainLength}`).join('\n');
  
  return csv;
}

  // Остальные методы остаются аналогичными...
  reset() {
    this.table = Array(this.segments).fill(null).map(() => []);
    this.elementCount = 0;
  }

  getAllItems(limit = 20) {
    const items = [];
    for (let i = 0; i < Math.min(this.table.length, limit); i++) {
      items.push({
        segment: i,
        items: [...this.table[i]],
        count: this.table[i].length
      });
    }
    return items;
  }
}

export const createHashTable = (segments = 1500) => new HashTable(segments);