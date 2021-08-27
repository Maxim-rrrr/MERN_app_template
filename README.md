# MERN_app_template

# Система авторизации

## Роли

Изначально надо создать роли пользователей в файле **./role_list.js**  

Пример:
```
export const USER = "USER";
export const ADMIN = "ADMIN";

export const ALL_ROLES = [
    USER,
    ADMIN
];
```
И запустить скрипт 
```
npm run create:roles
```

## Создание пользователей

Для создания пользователей можно использовать поле *start_users* в файле конфигурации  

Пример:
```
"start_users": [
    {
      "login": "admin",
      "pass": "123123",
      "roles": ["ADMIN"]
    }
]
```
И запустить скрипт 
```
npm run create:users
```

