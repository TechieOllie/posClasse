// Pour determiner le trimestre/semestre actuel
function defautTriOuSem(tr) {
    var date = new Date();
    var date2;
    trimestreFinal=tr.length-1;
    for (i = 0; i < tr.length-1; i++) {
        if (typeof tr[i].dateConseil != "undefined")
            date2 = new Date(tr[i].dateConseil.split("-")[0], tr[i].dateConseil.split("-")[1]-1, tr[i].dateConseil.split("-")[2]);
        else
            date2 = new Date(tr[i].dateFin.split("-")[0], tr[i].dateFin.split("-")[1]-1, tr[i].dateFin.split("-")[2]);
        console.log("date fin tri/semestre ", date2);
        if (date <= date2) {
            return i;
        }
    }
    return trimestreFinal;
}