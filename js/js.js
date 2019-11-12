$(function() {
	//天气图标
	var icons = {
		yun: {
			title: '多云',
			icon: './images/yun.png'
		},

		qing: {
			title: '晴',
			icon: './images/qing.png'
		},

		lei: {
			title: '雷阵雨',
			icon: './images/lei.png'
		},

		yu: {
			title: '小雨',
			icon: './images/xiao.png'
		},
		yin:{
			title:'阴天',
			icon: './images/yin.png'
		},
		default: {
			title: '未知',
			icon: ''
		}
	}


	function fn(city) {

		var data = {
			appid: '95684584',
			appsecret: 'ATP8ggR9',
			version: 'v6',
		};

		if (city !== undefined) {
			data.city = city;
		}

		$.ajax({
			type: 'GET',
			url: 'https://www.tianqiapi.com/api',
			dataType: 'jsonp',
			data: data,
			success: function(data) {
				console.log(data);

				$('.city-name').text(data.city);

				var weatherData = ['date', 'week', 'tem', 'wea', 'air_level', 'win', 'win_speed', 'win_meter'];

				for (var i = 0; i < weatherData.length; i++) {

					if (weatherData[i] === 'wea') {
						$('.' + weatherData[i]).css({
							backgroundImage: 'url(' + (icons[data.wea_img].icon == undefined ? icons.default : icons[data.wea_img].icon) + ')'
						});
					} else {
						$('.' + weatherData[i]).text(weatherData[i] === 'tem' ? data[weatherData[i]] + '℃' : data[weatherData[i]]);

					}

				}

				// $('.date').text(data.date);
				// $('.week').text(data.week);
				// $('.tem').text(data.tem + '℃');
				// $('.wea').text(data.wea);
				// $('.win').text(data.win);
				// $('.win_speed').text(data.win_speed);
				// $('.win_meter').text(data.win_meter);

				//24小时天气和未来6天天气
				var params = {
					appid: '95684584',
					appsecret: 'ATP8ggR9',
					version: 'v9'
				};

				if (city !== undefined) {
					params.city = city;
				}

				$.ajax({
					type: 'GET',
					url: 'https://www.tianqiapi.com/api',
					data: params,
					dataType: 'jsonp',
					success: function(result) {
						// console.log('result ==> ', result);

						//绑定24小时天气数据
						var hoursData = result.data[0].hours;

						$.each(hoursData, function(i, v) {

							var $li = $(
								`<li>
									<div>${v.hours}</div>
									<div class="hours-icon" style="background:url('${(icons[v.wea_img] == undefined ? icons.default : icons[v.wea_img].icon)}');background-position: center center;
    background-repeat: no-repeat;
    background-size: .2rem .2rem"></div>
									<div>${v.tem}℃</div>
									<div>${v.win}</div>
								</li>`
							);
							$('#hoursWeather').append($li);
						})

						var futureData = result.data.slice(1);

						$.each(futureData, function(i, v) {

							var $li = $(
								`<li>
									<span>${v.day.replace(/（星期[一二三四五六日]）/, '')}</span>
									<span class="future-icon" style="background:url('${(icons[v.wea_img] == undefined ? icons.default : icons[v.wea_img].icon)}');background-position: center center;
    background-repeat: no-repeat;
    background-size: .2rem .2rem" ></span>
									<span>${v.tem2 + '℃ ~' + v.tem1 + '℃'}</span>
									<span class="fr">${v.win[1]}</span>
								</li>`
							);

							$('#futureWeather').append($li);
						})

					}
				})

			}
		})

	}

	fn();

	$('.search').on('click', function() {

		var city = $('#input-text').val();

		if (city == undefined || city.trim() == '') {
			return;
		}

		$('#hoursWeather,#futureWeather').empty();


		fn(city);

	})


})
