// Pour determiner le semestre/actuel actuel
function defautTriOuSem(tr) {
    var date = new Date();
    var date2;
    for (i = 0; i < tr.length; i++) {
        date2 = new Date(tr[i].dateConseil.split("-")[0], tr[i].dateConseil.split("-")[1] - 1, tr[i].dateConseil.split("-")[2]);
        console.log(date2);
        if (date < date2) {
            return i;
        }
    }
}