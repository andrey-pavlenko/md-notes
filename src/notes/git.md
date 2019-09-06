<!---
{
  "tags": ["git", "dev"]
}
-->

# GIT

## Команды

Список текущих измнений `alias gis`
```
git status
```

История (текущая ветка) `alias gih`
```
git log --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short
```

История (все ветки) `alias giha`
```
git log --pretty=format:"%h %ad | %s%d [%an]" --graph --date=short --all
```

Chechout `alias gich`
```
git checkout master
git checkout fd12b0b
```

Add (добавить файлы для комита) `alias gia`
```
git add .
git add src/notes/git.md
```

Commit (файлы должны быть добавлены `git add`) `alias gico`
```
git commit -m "My first commit"
```

Исправление комита `alias giam`
```
git commit --amend ["New text"]
```

Branch (список веток) `alias gib`
```
git branch
```

Branch (создание ветки) `alias gib`
```
git branch new-branch
```

Fetch (получение комитов из удаленного репозитория) `alias gif`
```
git fetch
```

Сравнение `alias giff`
```
git difftool
```

## Настройки

Настройка редактора
```
git config --global core.editor mcedit
```

Настройка megre/diff
```
git config --global --add merge.tool kdiff3
git config --global --add diff.guitool kdiff3
git config --global --add mergetool.kdiff3.trustExitCode false
git config --global --add difftool.kdiff3.trustExitCode false
```

[Русские буквы в названии файла](http://yantonov.com/blog/2014/12/07/list-non-latin-file-names-in-git/):
```
git config --bool core.quotepath false
```
---

[Шпаргалка по GIT](http://dev-lab.info/2013/08/%D1%88%D0%BF%D0%B0%D1%80%D0%B3%D0%B0%D0%BB%D0%BA%D0%B0-%D0%BF%D0%BE-git-%D0%BE%D1%81%D0%BD%D0%BE%D0%B2%D0%BD%D1%8B%D0%B5-%D0%BA%D0%BE%D0%BC%D0%B0%D0%BD%D0%B4%D1%8B-%D1%81%D0%BB%D0%B8%D1%8F%D0%BD/)