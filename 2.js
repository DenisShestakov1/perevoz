const readline = require('readline');

// Функция для решения транспортной задачи методом северо-западного угла
function solveTransportProblemNW(supply, demand, costs) {
    const m = supply.length; // Количество поставщиков
    const n = demand.length; // Количество потребителей

    const allocation = Array.from({ length: m }, () => Array(n).fill(0)); // Матрица выделения

    let i = 0, j = 0; // Индексы для перебора

    // Пока есть доступные поставки и спрос
    while (i < m && j < n) {
        // Выбираем минимум из доступной поставки и спроса
        const quantity = Math.min(supply[i], demand[j]);

        // Выполняем выделение
        allocation[i][j] = quantity;

        // Уменьшаем доступные поставки и спрос на выделенное количество
        supply[i] -= quantity;
        demand[j] -= quantity;

        // Если доступная поставка исчерпана, переходим к следующему поставщику
        if (supply[i] === 0) {
            i++;
        }

        // Если спрос удовлетворен, переходим к следующему получателю
        if (demand[j] === 0) {
            j++;
        }
    }

    // Возвращаем результат
    return allocation;
}

// Функция для решения транспортной задачи методом минимального элемента
function solveTransportProblemMinElem(supply, demand, costs) {
    const m = supply.length; // Количество поставщиков
    const n = demand.length; // Количество потребителей

    const allocation = Array.from({ length: m }, () => Array(n).fill(0)); // Матрица выделения

    let totalCost = 0; // Переменная для хранения общей стоимости перевозок

    // Пока есть доступные поставки и спрос
    while (true) {
        // Ищем минимальный элемент в оставшихся клетках
        let minCost = Number.MAX_SAFE_INTEGER;
        let minI = -1, minJ = -1;
        for (let i = 0; i < m; ++i) {
            for (let j = 0; j < n; ++j) {
                if (supply[i] > 0 && demand[j] > 0 && costs[i][j] < minCost) {
                    minCost = costs[i][j];
                    minI = i;
                    minJ = j;
                }
            }
        }

        // Если не найден минимальный элемент, заканчиваем
        if (minI === -1 || minJ === -1) {
            break;
        }

        // Выделяем количество товара, равное минимальному элементу
        const quantity = Math.min(supply[minI], demand[minJ]);
        allocation[minI][minJ] = quantity;

        // Уменьшаем доступные поставки и спрос на выделенное количество
        supply[minI] -= quantity;
        demand[minJ] -= quantity;

        // Увеличиваем общую стоимость перевозок
        totalCost += quantity * costs[minI][minJ];
    }

    // Возвращаем результаты
    return { allocation, totalCost };
}

// Функция для ввода чисел с клавиатуры
async function inputNumber(prompt) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise((resolve) => {
        rl.question(prompt, (answer) => {
            rl.close();
            resolve(parseFloat(answer.trim()));
        });
    });
}

async function main() {
    const m = parseInt(await inputNumber("Введите количество поставщиков: "));
    const n = parseInt(await inputNumber("Введите количество потребителей: "));

    const supply = [];
    const demand = [];
    const costs = [];

    // Вводим поставки
    console.log("Введите значения поставок:");
    for (let i = 0; i < m; ++i) {
        supply.push(await inputNumber(`Поставка ${i + 1}: `));
    }

    // Вводим спрос
    console.log("Введите значения спроса:");
    for (let i = 0; i < n; ++i) {
        demand.push(await inputNumber(`Спрос ${i + 1}: `));
    }

    // Вводим стоимости перевозок
    console.log("Введите стоимости перевозок:");
    for (let i = 0; i < m; ++i) {
        costs.push([]);
        for (let j = 0; j < n; ++j) {
            costs[i].push(await inputNumber(`Стоимость от поставщика ${i + 1} к потребителю ${j + 1}: `));
        }
    }

    // Запрашиваем у пользователя метод решения
    const method = await inputNumber("Выберите метод решения (1 - северо-западный угол, 2 - минимальный элемент): ");
    if (method === 1) {
        // Решаем транспортную задачу методом северо-западного угла
        console.log("\nРезультаты выделения методом северо-западного угла:");
        console.log(solveTransportProblemNW([...supply], [...demand], [...costs]));
    } else if (method === 2) {
        // Решаем транспортную задачу методом минимального элемента
        const result = solveTransportProblemMinElem([...supply], [...demand], [...costs]);
        console.log("\nРезультаты выделения методом минимального элемента:");
        console.log(result.allocation);
        console.log("Минимальная стоимость перевозок:", result.totalCost);
    } else {
        console.log("Некорректный выбор метода.");
    }
}

main();
