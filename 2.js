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

    // Выводим результаты
    console.log("Результаты выделения методом северо-западного угла:");
    for (let i = 0; i < m; ++i) {
        console.log(allocation[i].join("\t"));
    }
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

    // Выводим результаты
    console.log("Результаты выделения методом минимального элемента:");
    for (let i = 0; i < m; ++i) {
        console.log(allocation[i].join("\t"));
    }

    // Выводим минимальную стоимость перевозки
    console.log("Минимальная стоимость перевозок: " + totalCost);
}

function main() {
    const readline = require('readline');
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.question("Введите количество поставщиков: ", (m) => {
        rl.question("Введите количество потребителей: ", (n) => {
            const supply = [];
            const demand = [];
            const costs = [];

            // Вводим поставки
            console.log("Введите значения поставок:");
            let count = 0;
            const inputSupply = () => {
                rl.question(`Поставка ${count + 1}: `, (val) => {
                    supply.push(parseInt(val));
                    count++;
                    if (count < m) {
                        inputSupply();
                    } else {
                        count = 0;
                        inputDemand();
                    }
                });
            };

            // Вводим спрос
            const inputDemand = () => {
                console.log("Введите значения спроса:");
                rl.question(`Спрос ${count + 1}: `, (val) => {
                    demand.push(parseInt(val));
                    count++;
                    if (count < n) {
                        inputDemand();
                    } else {
                        count = 0;
                        inputCosts();
                    }
                });
            };

            // Вводим стоимости перевозок
            const inputCosts = () => {
                console.log("Введите стоимости перевозок:");
                for (let i = 0; i < m; ++i) {
                    costs.push([]);
                    for (let j = 0; j < n; ++j) {
                        rl.question(`Стоимость от поставщика ${i + 1} к потребителю ${j + 1}: `, (val) => {
                            costs[i].push(parseInt(val));
                            if (costs[i].length === n) {
                                if (i === m - 1 && j === n - 1) {
                                    rl.close();
                                    inputMethod();
                                }
                            }
                        });
                    }
                }
            };

            // Запрашиваем у пользователя метод решения
            const inputMethod = () => {
                rl.question("Выберите метод решения (1 - северо-западный угол, 2 - минимальный элемент): ", (choice) => {
                    if (choice == 1) {
                        solveTransportProblemNW(supply, demand, costs);
                    } else if (choice == 2) {
                        solveTransportProblemMinElem(supply, demand, costs);
                    } else {
                        console.log("Некорректный выбор метода.");
                    }
                });
            };

            inputSupply();
        });
