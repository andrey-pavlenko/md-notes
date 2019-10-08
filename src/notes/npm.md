<!---
{
  "tags": ["npm", "node", "nodejs", "package"]
}
-->
![NPM Logo](img/npm_logo.png)

# Менеджер пакетов npm

Список глобальных установленных пакетов, которые не имеют зависимостей (корневые):
```
npm list -g --depth=0 2>/dev/null
```

Список глобальных пакетов, которые нуждаются в обновлении:
```
npm outdated -g --depth=0
```

Обновление одного пакета (глобального):
```
npm update -g <package_name>
```

![Screenshot](img/U6AfG.png)