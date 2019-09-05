<!--
{
  "tags": ["android", "adv", "adb", "hosts"]
}
-->
# Android virtual device

## Genymotion

Personal use &ndash; бесплатно.

### Редактирование hosts на виртуальном устройстве

Извлекли hosts из виртуального устройства:  
```
mount -o rw,remount /dev/block/sda6 /system
adb pull /etc/hosts hosts
```

Поправили hosts:  
```
127.0.0.1      localhost
192.168.31.120 qui-quo.ru
```

Загрузили в виртуальное устройство:  
```
adb push hosts /etc/
mount -o ro,remount /dev/block/sda6 /system
```

### Загрузка приложения для установки

Закидываем файл на устройство:  
```
# adb devices -l
# adb -s 192.168.56.103:5555  shell 
# ls /sdcard/Download/
# adb -s 192.168.56.103:5555 push Telegram_5.9.0_\(Android4\,universal\).apk /sdcard/Download/
```