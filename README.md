# MEPHI Graphic Labs

## Что можно делать?

- Построить прямую
- Построить полигон
- Построить кривую Безье
- Построить составную кривую Эрмита
- Построить куб

Чтобы построить объект, необходимо нажать на карандаш (включить режим редактирования) и ввести необходимое кол-во точек. Затем отключить режим редактирования.

Построение кривой Эрмита производится на основе векторов. Чтобы ввести вектор необходимо:
- Нажать ЛКМ
- Перемещать курсор мыши в желанном направлении
- Отпустить ЛКМ

Построение куба: Задается левая-нижняя точка куба.

--------
<b>При клике на каждый объект открывается меню</b>

### Прямые

- Отсечь полигоном
- Удалить

При отсечении полигоном необходимо указать вершины, затем отключить режим редактирования, нажав на карандаш

### Полигоны

- Закрасить
- Узнать тип
- Построить выпуклую оболочку
- Удалить

Закрасить можно по двум алгоритмам: even-odd и non-zero-winding


### Кривые

- Удалить

### Куб

- Вращать/остановить
- Показать невидимые грани / скрыть
- Включить / Отключить одноточечную проекцию
- Удалить 

#### Вращение

При выборе этого пункта меню включится режим редактирования. Необходимо задать конечную точку радиус-вектора. 
Начало находится в середине экрана.

#### Удалить

Чтобы сработало, нужно значала остановить куб.

## Запуск

https://ggermashev.github.io/graphic-labs/

Или локально
- перенести проект себе (например, git pull)
- перейти в корневую директорию (где находится package.json)
- npm i (установка зависимостей)
- npm start (запуск сервера на localhost:3000)

(необходимо иметь node)

## PS
Не продуманно под мобильную версию, но попробовать можно :)