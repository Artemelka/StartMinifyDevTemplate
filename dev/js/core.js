(() => {
	const headTag = document.querySelector('head');
	const bodyTag = document.querySelector('body');

	// служебные
	let countScriptLoad, countScriptAdd, a, i, j;

    // добавляем хэш для файла стилей
	const unicHash = () => ('_' + Math.random().toString(36).substr(2, 9));
	const urlStyleWithHash = `css/style.min.css?hash=${unicHash()}`;

	// Объект содержащий скрипты и css с отложенной загрузкой
	// очередь загрузки: ключ dep = 1 первые
	const linksCollection = {
		cssMain:{type:'css', href: urlStyleWithHash, dep:'5'},
		jsJquery:{type:'js', src:'lib/jquery-3.2.0.min.js', dep:'2'},
		jsMain:{type:'js', src:'js/all.min.js', dep:'4'}
	};

    // создание CSS линков
    const createCssLink = (el) => {
        if (el.href) {
            const tagLink = document.createElement('link');

            tagLink.setAttribute('rel', 'stylesheet');
            tagLink.setAttribute('href', el.href);
            headTag.appendChild(tagLink);
        } else {
            console.log(el + ' ' + 'нет свойства "href"'); // вывод в консоль не загруженных объектов
        }
    };
    // создание JS линков
    const createJsLink = (el) => {
        if (el.src) {
            const tagScript = document.createElement('script');

            tagScript.setAttribute('dep', '0');
            tagScript.setAttribute('src', el.src);
            bodyTag.appendChild(tagScript);
            countScriptAdd++;

            // отслеживание загрузки добавленных скриптов очереди
            const addScripts = document.getElementsByTagName('script');

            [...addScripts].map(tag => {
                if (tag.getAttribute('dep') === '0') {
                    tag.addEventListener('load', function () {
                        this.removeAttribute('dep');
                        countScriptLoad++;
                        // запуск следующей очереди
                        if (countScriptAdd === countScriptLoad) {
                            createLinks();
                        }
                    });
                }
            });
        } else {
            console.log(el + ' ' + 'нет свойства "src"'); // вывод в консоль не загруженных объектов
        }
    };

	const createLinks = () => {
		countScriptLoad		= 0; // обнуляем счетчик загрузившихся скриптов
		countScriptAdd		= 0; // обнуляем счетчик добавленых скриптов
		a 					= 0; // обнуляем счетчик очереди

        Object.values(linksCollection).map(item => {
            if (item.dep === '1') {
                // убираем объект из очереди
                item.dep = '0';
                // подключаем объект
                switch (item.type) {
                    case 'css':

                        createCssLink(item);
                        break;
                    case 'js':
                        createJsLink(item);
                        break;
                    default:
                        console.log(item + ' ' + 'нет свойства "type"'); // вывод в консоль не загруженных объектов
                        break;
                }
            } else {
                // сдвиг очереди
                if (item.dep > 1) {
                    item.dep = (item.dep - 1).toString();
                    a++; // увеличение счетчика очереди для следующего запуска
                }
            }
        });

		// for (key in linksCollection) {
		// 	if (linksCollection[key].dep == 1) {
		// 		// убираем объект из очереди
		// 		linksCollection[key].dep = '0';
		// 		// подключаем объект
		// 		switch (linksCollection[key].type) {
		// 			case 'css':
		// 				createCssLink(linksCollection[key]);
		// 				break;
		// 			case 'js':
		// 				createJsLink(linksCollection[key]);
		// 				break;
		// 			default:
		// 				console.log(linksCollection[key] + ' ' + 'нет свойства "type"'); // вывод в консоль не загруженных объектов
		// 				break;
		// 		}
		// 	} else {
		// 		// сдвиг очереди
		// 		if (linksCollection[key].dep > 1) {
		// 			linksCollection[key].dep = linksCollection[key].dep - 1;
		// 			a++; // увеличение счетчика очереди для следующего запуска
		// 		}
		// 	}
		// }

		// запуск следующей очереди
		if (a > 0 && countScriptAdd == countScriptLoad) {
			// console.log('a = ' + a);
			createLinks();
		} else {
			// console.log('a = ' + a + ' ' + 'add = ' + countScriptAdd + ' ' + 'load = ' + countScriptLoad);
		}





	};
    // Загрузка картинок
	const lazyloadImg = () => {
		const imgCollection = document.querySelectorAll('img[data-src]');

        [...imgCollection].map(img => {
            if (img.getAttribute('data-src')) {
                img.setAttribute('src', img.getAttribute('data-src'));
                img.removeAttribute('data-src');
            }
        });
	};

    // После отображения первого экрана загружаем скрипты, css, и изображения
    window.addEventListener('load', createLinks);
    window.addEventListener('load', lazyloadImg);
})();
