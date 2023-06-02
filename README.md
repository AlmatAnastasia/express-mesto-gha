[![Tests](../../actions/workflows/tests-13-sprint.yml/badge.svg)](../../actions/workflows/tests-13-sprint.yml) [![Tests](../../actions/workflows/tests-14-sprint.yml/badge.svg)](../../actions/workflows/tests-14-sprint.yml)
# Проект Mesto фронтенд + бэкенд
---
**_Содержание файла README.md_**

<p>
<a href="#description">Описание</a>
<br>
<a href="#start">Запуск проекта</a>
<br>
<a href="#demo">Демонстрация</a>
<br>
<a href="#file_structure">Файловая структура</a>
<br>
<a href="#technologies">Использованные технологии</a>
<br>
<a href="#functionality">Функциональность</a>
</p>

<div id="description"></div>
<h2>Описание</h2>
<p>Данный проект представляет собой Backend часть сервиса Mesto: интерактивную страницу, отображающую карточки с фотографиями мест.</p>

<div id="start"></div>
<h2>Запуск проекта</h2>
<p>`npm run start` — запускает сервер</br>  
`npm run dev` — запускает сервер с hot-reload</p>

<div id="demo"></div>
<h2>Демонстрация</h2>
<h3>Ссылка на сайт <a href="https://almatanastasia.github.io/express-mesto-gha/">тут</a> !</h3>

<div id="file_structure"></div>
<h2>Файловая структура</h2>
<pre>
.
├── controllers        # Директория содержит файлы описания моделей пользователя и карточки<br>
├── errors             # Директория содержит файлы описания ошибок<br>
├── models             # Директория содержит файлы описания схем пользователя и карточки<br>
├── routes             # Директория содержит описание основных роутов для пользователя и карточки<br>
├── utils              # Файлы утилитарных модулей (отдельные функции и константы)<br>
├── .editorconfig      # Файл для определения стилей кодирования и набора подключаемых модулей текстового редактора<br>
├── .eslintrc          # Файл конфигурации утилиты, которая может анализировать написанный код (ESLint)<br>
├── .gitignore         # Файл для игнорирования/предотвращения передачи файлов<br>
├── .app.js            # Файл  включает основную логику сервера, запуск и подключение к базе данных<br>
├── package-lock.json  # Файл блокировки, содержащий информацию о зависимостях/пакетах с их точными номерами версий<br>
├── package.json       # Файл управления версиями, используемый для установки нескольких пакетов в проекте<br>
├── README.md          # Файл документации проекта<br>
</pre>

<div id="technologies"></div>
<h2>Использованные технологии</h2>
<p>
⬥ Postman <br>
⬥ Express<br>
⬥ Node.js<br>
⬥ MongoDB (Mongoose)
</p>
  
<div id="functionality"></div>
<h2>Функциональность</h2>
<p>✶ Добавление и редактирование информации о себе</p>
<p>✶ Добавление и редактирование информации о своем аватаре</p>
<p>✶ Добавление и удаление карточки</p>
<p>✶ Добавление и удаление лайка карточки</p>
