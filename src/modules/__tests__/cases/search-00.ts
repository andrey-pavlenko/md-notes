const ruText1 = `По версии AdaptiveMobile Security, атака работает следующим образом: на телефон жертвы отправляется подготовленное SMS, которое задействует функциональность S@T Browser. В нормальном режиме эта программа реализует систему меню для общения с оператором — для запроса баланса и тому подобного. Атакующие используют возможности этой программы для запроса IMEI и координат устройства по ближайшим базовым станциям. Данные в виде SMS отправляются злоумышленникам, причем владелец телефона не видит ни входящих, ни исходящих сообщений.

S@T Browser можно считать устаревшей технологией из времен, когда мобильные телефоны еще не являлись смартфонами. Функциональность такого софта перекочевала в нативные приложения для Android и iOS, а спецификации ПО не обновлялись с 2009 года. Тем не менее, для обратной совместимости этот элемент по-прежнему встраивается в SIM-карты. Решение за оператором, но по грубым прикидкам авторов исследования, этот специализированный софт используется операторами в 30 странах с совокупным числом абонентов более миллиарда.

В AdaptiveMobile делают громкое заявление о первом случае вредоносного ПО, распространяемого через СМС. Не факт, что эксплуатацию возможностей кода на SIM-карте стоит называть именно так, но важны не термины, а тот факт, что геолокацией все не ограничивается. Такой метод атаки дает злоумышленникам доступ и к другим командам, которые инициируются программным кодом на SIM-карте и могут дальше передаваться в основную операционную систему телефона. Например, есть возможность проиграть мелодию, инициировать звонок, отправить произвольное SMS на произвольный номер, выполнить USSD-запрос и так далее. Не все функции можно задействовать без ведома пользователя. Так, исходящий звонок на некоторых телефонах потребует подтверждения.

Еще один важный момент заключается в том, что это активно эксплуатируемая уязвимость. Предположение исследователей заключается в том, что организатором атаки является частная организация, работающая на правительственные структуры. Оценивается и количество жертв: например, в одной из стран были зафиксированы атаки на 100–150 телефонных номеров, причем на некоторые из них поступают десятки запросов в неделю. Наряду с запросами через SMS, те же самые атакующие используют известные уязвимости в протоколе SS7.
`;

const ruText2 = `О том, что «Гигафабрика 3» будет расширяться, ранее ничего не сообщалось, но теперь ясно, что это именно так. Изначально планировалось, что батареи будут производиться здесь же, но затем руководство приняло решение отказаться от этого плана хотя бы временно, чтобы выпускать как можно больше электромобилей.

А вот дополнительные площади, которые готовятся к застройке прямо сейчас, вполне могут быть использованы для разворачивания цехов по производству батарей. Это позволило бы компании не зависеть от поставок аккумуляторов и собирать электрокары на месте.

К слову, китайские регуляторы выдали разрешение на строительство быстрее, чем когда-либо.

Увеличиваются и размеры других предприятий компании. В частности, Tesla заявила, что «Гигафабрика 1» продолжает расширяться.

Ну а на третьей «Гигафабрике» производство машин начнется уже в следующем месяце. План — 3000 электрокаров в неделю.`;

export { ruText1, ruText2 };