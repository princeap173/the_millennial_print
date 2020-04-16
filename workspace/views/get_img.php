<?php
	extract($_GET);
	$fp=fopen($param,"r");
	$str=fread($fp,filesize($param));
	echo $str;
?>