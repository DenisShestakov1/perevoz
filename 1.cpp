#include <iostream>
#include <vector>

using namespace std;

// Функция для решения транспортной задачи методом северо-западного угла
void solveTransportProblemNW(vector<int>& supply, vector<int>& demand, vector<vector<int>>& costs) {
    int m = supply.size(); // Количество поставщиков
    int n = demand.size(); // Количество потребителей

    vector<vector<int>> allocation(m, vector<int>(n, 0)); // Матрица выделения

    int i = 0, j = 0; // Индексы для перебора

    // Пока есть доступные поставки и спрос
    while (i < m && j < n) {
        // Выбираем минимум из доступной поставки и спроса
        int quantity = min(supply[i], demand[j]);

        // Выполняем выделение
        allocation[i][j] = quantity;

        // Уменьшаем доступные поставки и спрос на выделенное количество
        supply[i] -= quantity;
        demand[j] -= quantity;

        // Если доступная поставка исчерпана, переходим к следующему поставщику
        if (supply[i] == 0) {
            i++;
        }

        // Если спрос удовлетворен, переходим к следующему получателю
        if (demand[j] == 0) {
            j++;
        }
    }

    // Выводим результаты
    cout << "Результаты выделения методом северо-западного угла:" << endl;
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < n; ++j) {
            cout << allocation[i][j] << "\t";
        }
        cout << endl;
    }
}

// Функция для решения транспортной задачи методом минимального элемента
void solveTransportProblemMinElem(vector<int>& supply, vector<int>& demand, vector<vector<int>>& costs) {
    int m = supply.size(); // Количество поставщиков
    int n = demand.size(); // Количество потребителей

    vector<vector<int>> allocation(m, vector<int>(n, 0)); // Матрица выделения

    int totalCost = 0; // Переменная для хранения общей стоимости перевозок

    // Пока есть доступные поставки и спрос
    while (true) {
        // Ищем минимальный элемент в оставшихся клетках
        int minCost = INT_MAX;
        int minI = -1, minJ = -1;
        for (int i = 0; i < m; ++i) {
            for (int j = 0; j < n; ++j) {
                if (supply[i] > 0 && demand[j] > 0 && costs[i][j] < minCost) {
                    minCost = costs[i][j];
                    minI = i;
                    minJ = j;
                }
            }
        }

        // Если не найден минимальный элемент, заканчиваем
        if (minI == -1 || minJ == -1) {
            break;
        }

        // Выделяем количество товара, равное минимальному элементу
        int quantity = min(supply[minI], demand[minJ]);
        allocation[minI][minJ] = quantity;

        // Уменьшаем доступные поставки и спрос на выделенное количество
        supply[minI] -= quantity;
        demand[minJ] -= quantity;

        // Увеличиваем общую стоимость перевозок
        totalCost += quantity * costs[minI][minJ];
    }

    // Выводим результаты
    cout << "Результаты выделения методом минимального элемента:" << endl;
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < n; ++j) {
            cout << allocation[i][j] << "\t";
        }
        cout << endl;
    }

    // Выводим минимальную стоимость перевозки
    cout << "Минимальная стоимость перевозок: " << totalCost << endl;
}

int main() {
    setlocale(LC_ALL, "rus");
    int m, n;
    int choice;

    cout << "Введите количество поставщиков: ";
    cin >> m;

    cout << "Введите количество потребителей: ";
    cin >> n;

    // Вводим поставки
    vector<int> supply(m);
    cout << "Введите значения поставок:" << endl;
    for (int i = 0; i < m; ++i) {
        cout << "Поставка " << i + 1 << ": ";
        cin >> supply[i];
    }

    // Вводим спрос
    vector<int> demand(n);
    cout << "Введите значения спроса:" << endl;
    for (int i = 0; i < n; ++i) {
        cout << "Спрос " << i + 1 << ": ";
        cin >> demand[i];
    }

    // Вводим стоимости перевозок
    vector<vector<int>> costs(m, vector<int>(n));
    cout << "Введите стоимости перевозок:" << endl;
    for (int i = 0; i < m; ++i) {
        for (int j = 0; j < n; ++j) {
            cout << "Стоимость от поставщика " << i + 1 << " к потребителю " << j + 1 << ": ";
            cin >> costs[i][j];
        }
    }

    // Запрашиваем у пользователя метод решения
    cout << "Выберите метод решения (1 - северо-западный угол, 2 - минимальный элемент): ";
    cin >> choice;

    // Решаем транспортную задачу в зависимости от выбора пользователя
    if (choice == 1) {
        solveTransportProblemNW(supply, demand, costs);
    }
    else if (choice == 2) {
        solveTransportProblemMinElem(supply, demand, costs);
    }
    else {
        cout << "Некорректный выбор метода." << endl;
    }

    return 0;
}
