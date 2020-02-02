function del() {
    if (document.getElementsByTagName("b")[0] != undefined) {
        document.body.removeChild(document.getElementById(document.getElementsByTagName("b")[0].parentNode.parentNode.id));
        document.getElementsByTagName("div")[0].remove();
    } else if (document.getElementsByTagName("div") != undefined) {
        for (i = 0; i < 10; i++) {
            document.getElementsByTagName("div")[i].style.display = "none";
        }
    }
}