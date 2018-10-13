(function FastPageLoad() {
	var headTag 			= document.querySelector('head');
	var bodyTag 			= document.querySelector('body');
	var countScriptLoad;
	var countScriptAdd;
	var a;

	// Объект содержащий скрипты и css с отложенной загрузкой
	// очередь загрузки: ключ dep = 1 первые
	var linksCollection = {
		cssMain:{type:'css', href:'css/style.min.css', dep:'5'},
		cssFotorama:{type:'css', href:'http://cdnjs.cloudflare.com/ajax/libs/fotorama/4.6.4/fotorama.css', dep:'1'},
		jsJquery:{type:'js', src:'lib/jquery-3.2.0.min.js', dep:'2'},
		// apiYMap:{type:'js', src:'https://api-maps.yandex.ru/2.1/?lang=ru_RU', dep:'1'},
		jsFotorama:{type:'js', src:'lib/fotorama.js', dep:'3'},
		jsMain:{type:'js', src:'js/all.min.js', dep:'4'}
	};

	// После отображения первого экрана загружаем скрипты, css, и изображения
	window.addEventListener('load', createLinks);
	window.addEventListener('load', lazyloadImg);

	function createLinks() {
		countScriptLoad		= 0; // обнуляем счетчик загрузившихся скриптов
		countScriptAdd		= 0; // обнуляем счетчик добавленых скриптов
		a 					= 0; // обнуляем счетчик очереди

		// console.log('start create');

		for (var key in linksCollection) {
			if (linksCollection[key].dep == 1) {

				// убираем объект из очереди
				linksCollection[key].dep = '0';

				// подключаем объект
				switch (linksCollection[key].type) {
					case 'css': 
						createCssLink(linksCollection[key]);
						break
					case 'js' : 
						createJsLink(linksCollection[key]);
						break
					default :
						// вывод в консоль не загруженных объектов
						console.log(linksCollection[key] + ' ' + 'нет свойства "type"');
						break
				}
			} else {
				// сдвиг очереди
				if (linksCollection[key].dep > 1) {
					linksCollection[key].dep = linksCollection[key].dep - 1;
					a++; // увеличение счетчика очереди для следующего запуска
				}
			}
		}

		// запуск следующей очереди
		if (a > 0 && countScriptAdd == countScriptLoad) {
			// console.log('a = ' + a);
			createLinks();
		} else {
			// console.log('a = ' + a + ' ' + 'add = ' + countScriptAdd + ' ' + 'load = ' + countScriptLoad);
		}
		
	
		
		function createCssLink(el) { 
			if (el.href) {
				var tagLink = document.createElement('link');

				tagLink.setAttribute('rel', 'stylesheet');
				tagLink.setAttribute('href', el.href);
				headTag.appendChild(tagLink);

				// console.log('create css:' + el.href);
			} else {
				// вывод в консоль не загруженных объектов
				console.log(el + ' ' + 'нет свойства "href"');
			}
		};
		function createJsLink(el) {
			if (el.src) {
				var tagScript = document.createElement('script');

				tagScript.setAttribute('dep', 0);
				tagScript.setAttribute('src', el.src);
				bodyTag.appendChild(tagScript);
				countScriptAdd++;

				// console.log('create js:' + el.src);

				// отслеживание загрузки добавленных скриптов очереди
				var addScripts = document.getElementsByTagName('script');

				for (var i = 0; i < addScripts.length; i++) {
					// console.log(addScripts[i].hasAttribute('dep'));

					if (addScripts[i].getAttribute('dep') == 0) {
						// console.log('load ON');
						addScripts[i].addEventListener('load', function () {
							this.removeAttribute('dep');
							// console.log('script load');
							countScriptLoad++;

							// запуск следующей очереди
							if (countScriptAdd == countScriptLoad) {
								// console.log('add = ' + countScriptAdd + ' ' + 'load = ' + countScriptLoad);
								createLinks();
									
							} else {
								// console.log('count !=');
							}
						});
					} 
				}
			} else {
				// вывод в консоль не загруженных объектов
				console.log(el + ' ' + 'нет свойства "src"');
			}
		};
	};
	function lazyloadImg() {
		var imgCollection = document.querySelectorAll('img[data-src]');

		for(var i = 0; i < imgCollection.length; i++) {
			if(imgCollection[i].getAttribute('data-src')) {
				imgCollection[i].setAttribute('src', imgCollection[i].getAttribute('data-src'));
				imgCollection[i].removeAttribute('data-src');	
			}	
		}
	};		
})();