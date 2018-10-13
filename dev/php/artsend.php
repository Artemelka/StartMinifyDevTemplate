<?php

if ($_SERVER['REQUEST_METHOD']== "POST") {

if( isset($_POST['gps']) && $_POST['gps'] != ""
	&& isset($_POST['name']) && $_POST['name'] != ""
	&& isset($_POST['phone']) && $_POST['phone'] != "" ){

	//Принимаем постовые данные
	$gps=$_POST['gps'];
	$name=$_POST['name'];
	$phone=$_POST['phone'];

	//Тут указываем на какой ящик посылать письмо
	$to = "aemelianov85@gmail.com";
	//Далее идет тема и само сообщение
	$subject = "Заявка с сайта";
	$message = "Письмо отправлено c сайта Artemelka.ru<br />
	Откуда: ".htmlspecialchars($gps)."<br />
	Имя: ".htmlspecialchars($name)."<br />
	Телефон: ".htmlspecialchars($phone);
	$headers = "From: Artemelka.ru <info@artemelka.ru>\r\nContent-type: text/html; charset=utf-8 \r\n";
	mail ($to, $subject, $message, $headers);
	header('Location: thanks.html');
}else{
	header('Location: http://artemelka.ru/');
}

exit;
?>
