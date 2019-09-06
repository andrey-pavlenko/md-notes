<!--
{
  "tags": ["android", "dev", "java", "udev"]
}
-->
# Инструменты разработки под Android

### Установка приложений для разработки под андроид:

* android-sdk-r21.0.1-2-x86 (из AUR) + jre7-openjdk
* android-sdk-platform-tools-r16.0.1-2

Потом заменил на Oracle JRE 7.13 (наверное можно заменить на Oracle JDK)  
Удалил мешающие пакеты: `pacman -Rdd`  
Нужно добавить путь к Java в `$PATH`

Выполнить `/opt/android-sdk/tools/android` и установить необходимые пакеты.

Для eclipse установить пакеты (AUR): `eclipse-emf eclipse-gef eclipse-wtp eclipse-android`

#### Подключение Newman N1 к adb

Использовать udev, `/etc/udev/rules.d/51-android.rules`:

```
# Newman N1
SUBSYSTEM=="usb", ATTR{idVendor}=="0bb4", MODE="0666"
SUBSYSTEM=="usb",ATTR{idVendor}=="0bb4",ATTR{idProduct}=="0c03",SYMLINK+="android_adb"
SUBSYSTEM=="usb",ATTR{idVendor}=="0bb4",ATTR{idProduct}=="0c03",SYMLINK+="android_fastboot"

# Explay Informer
SUBSYSTEM=="usb", ATTR{idVendor}=="18d1", MODE="0666"
SUBSYSTEM=="usb",ATTR{idVendor}=="18d1",ATTR{idProduct}=="0003",SYMLINK+="android_adb"
SUBSYSTEM=="usb",ATTR{idVendor}=="18d1",ATTR{idProduct}=="0003",SYMLINK+="android_fastboot"

# UG-802-V2
SUBSYSTEM=="usb", ATTR{idVendor}=="2207", MODE="0666"
SUBSYSTEM=="usb",ATTR{idVendor}=="2207",ATTR{idProduct}=="0010",SYMLINK+="android_adb"
SUBSYSTEM=="usb",ATTR{idVendor}=="2207",ATTR{idProduct}=="0010",SYMLINK+="android_fastboot"
```

Перезагрузка правил: `udevadm control --reload-rules`

Запуск adb: `adb devices`

```
List of devices attached 
0123456789ABCDEF        device
```

Устройство UG802-V2 не подлючается в Eclipse:  
Добавил Vendor_ID в файл `/home/andrey/.android/adb_usb.ini`

```
0x2207
```
