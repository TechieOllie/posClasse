function switchStyle(style) {
	document.getElementById("mycss").setAttribute("href", style);
}
		
// Thème par défaut en fonction de l'heure
var hour = new Date().getHours();
if (hour > 8 && hour < 20) {
	document.getElementById("mycss").setAttribute("href", 'css/style_light.css');
}
else {
	document.getElementById("mycss").setAttribute("href", 'css/style_dark.css');
}
