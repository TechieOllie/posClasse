// Affichage des matières
function afficherMatiere(matieres, effectif, reponse, tr) {
    // Création des tableaux
    rang = [];
    discipline = [];

    // Variable pour fin tri/semestre
    let finEcheance = new Date(reponse.data.periodes[tr].dateFin);
    let debEchance = new Date(reponse.data.periodes[tr].dateDebut);

    // Remplissage du tableau
    for (i = 0; i < matieres.length; i++) {
        discipline.push(matieres[i].discipline);
        rang.push(matieres[i].rang);
    }

    console.log(rang);
    console.log(discipline);

    // Classement des moyennes
    var listeDevoirs = reponse.data.notes;
    var tableauDevoirs = {}; // Contient par matière les notes, surX et le coeff pour chaque valeur

    for (x of listeDevoirs) {
        if (new Date(x.date) <= finEcheance && new Date(x.date) > debEchance && !x.nonSignificatif) { // Correpond aux echeances (si les profs remplissent au bon moment...) + significatif
            if (tableauDevoirs[x.libelleMatiere] == undefined) {
                tableauDevoirs[x.libelleMatiere] = [];
                if (!isNaN(parseFloat(x.valeur))) { // Verif si absent
                    tableauDevoirs[x.libelleMatiere].push([parseFloat(x.valeur.replace(",", ".")), parseFloat(x.noteSur.replace(",", ".")), parseFloat(x.coef.replace(",", "."))]);
                }
            } else {
                if (!isNaN(parseFloat(x.valeur))) { // Pareil
                    tableauDevoirs[x.libelleMatiere].push([parseFloat(x.valeur.replace(",", ".")), parseFloat(x.noteSur.replace(",", ".")), parseFloat(x.coef.replace(",", "."))]);
                }
            }
        }
    }

    console.log(tableauDevoirs);

    // Création du tableau "physique"
    var table = document.createElement("table");
    table.id = "table";

    var colonne = document.createElement("tr");
    colonne.id = "column";

    var disciplineTable = document.createElement("th");
    disciplineTable.id = "disciplineTable";
    disciplineTable.innerText = "Matières";

    var rangTable = document.createElement("th");
    rangTable.id = "rangTable";
    rangTable.innerText = "Position";

    var moyenneNoteTable = document.createElement("th");
    moyenneNoteTable.id = "moyenneNoteTable";
    moyenneNoteTable.innerText = "Notes";

    document.getElementsByTagName("body")[0].appendChild(table);
    table.appendChild(colonne);

    var column = document.getElementById("column");
    column.appendChild(disciplineTable);
    column.appendChild(rangTable);
    column.appendChild(moyenneNoteTable);

    // Remplissage du tableau "physique"
    var moyenneGen = 0;
    var rangGen = 0;
    var sommeCoeffMatiere = 0;

    for (i = 0; i < matieres.length; i++) {
        var newTable = document.createElement("tr");
        document.getElementById("table").appendChild(newTable);

        // Disciplines
        var newTableD = document.createElement("td");
        newTableD.innerText = matieres[i].discipline
        document.getElementsByTagName("tr")[i + 1].appendChild(newTableD);

        // Rang
        var newTableR = document.createElement("td");
        newTableR.innerText = "/";
        if (matieres[i].rang != "0") { // Si pas de rang, on met un slash
            newTableR.innerText = matieres[i].rang;
        }
        
        // Couleur en fonction du classement (necessite la variable effectif, pas toujours présente...)
        if (matieres[i].rang == 0) {
            newTableR.style = "";
        } else if (matieres[i].rang <= Math.round(effectif * 1 / 3)) {
            newTableR.style = "background-color: green;";
        } else if (matieres[i].rang <= Math.round(effectif * 2 / 3)) {
            newTableR.style = "background-color: yellow;";
        } else if (matieres[i].rang <= Math.round(effectif * 3 / 3)) {
            newTableR.style = "background-color: red;";
        }

        document.getElementsByTagName("tr")[i + 1].appendChild(newTableR);

        // Calcul + affichage des moyennes
        var newTableE = document.createElement("td");
        var moyenneNotes = 0;
        var sommeCoeff = 0;
        var sommeNotes = 0;

        if (tableauDevoirs[matieres[i].discipline] != undefined) {
            for (chaqueNote of tableauDevoirs[matieres[i].discipline]) {
                sommeNotes += (chaqueNote[0] / chaqueNote[1]) * chaqueNote[2];
                sommeCoeff += chaqueNote[2];
            }
            moyenneNotes = Math.round(sommeNotes / sommeCoeff * 2000) / 100;
            moyenneGen += moyenneNotes * parseFloat(matieres[i].coef);
            rangGen += parseFloat(matieres[i].rang) * parseFloat(matieres[i].coef);
            sommeCoeffMatiere += parseFloat(matieres[i].coef);
        } else {
            moyenneNotes = "/"; // Sinon, affiche un slash
        }

        newTableE.innerText = moyenneNotes;
        document.getElementsByTagName("tr")[i + 1].appendChild(newTableE);
    }

    // Affichage pour rang moyen, notes moyennes
    var newTable = document.createElement("tr");
    document.getElementById("table").appendChild(newTable);

    var newTableD = document.createElement("td");
    newTableD.style = "font-weight: bold";
    newTableD.innerText = "Moyennes";
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableD);

    var newTableR = document.createElement("td");
    if (rangGen != 0 && sommeCoeffMatiere != 0)
        newTableR.innerText = Math.round(rangGen / sommeCoeffMatiere);
    else
        newTableR.innerText = "/";
    newTableR.style = "font-weight: bold";
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableR);

    var newTableE = document.createElement("td");
    if (moyenneGen != 0 && sommeCoeffMatiere != 0)
        newTableE.innerText = Math.round(moyenneGen / sommeCoeffMatiere * 100) / 100;
    else
        newTableE.innerText = "/";


    newTableE.style = "font-weight: bold";
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableE);

    // Message mise à jour notes
    var maj = document.createElement("p");
    maj.style = "font-style: italic;";

    var notes = [];
    var dateMtn = new Date();

    for (k = 0; k < reponse.data.notes.length; k++) {
        notes.push(new Date() - new Date(parseInt(reponse.data.notes[k].dateSaisie.split("-")[0]), parseInt(reponse.data.notes[k].dateSaisie.split("-")[1]) - 1, parseInt(reponse.data.notes[k].dateSaisie.split("-")[2])));
    }
    console.log(notes);
    console.log(notes.indexOf(Math.min(...notes)))
    maj.innerText = "Dernière mise a jour des notes le : " + reponse.data.notes[notes.indexOf(Math.min(...notes))].dateSaisie + ".\nDernier calcul du classement le : " + reponse.data.periodes[reponse.data.periodes.length - 1].ensembleMatieres.dateCalcul + ".";

    maj.style = "font-style: italic;";
    document.getElementsByTagName("body")[0].appendChild(maj);

    function disconnect() {
        localStorage.clear();
        cookie = false;

        document.getElementById("login").value = "";
        document.getElementById("password").value = "";

        document.getElementsByTagName("p")[0].remove();
        document.getElementsByTagName("table")[0].remove();
        document.getElementById("deco").remove();

        document.getElementById("login").disabled = false;
        document.getElementById("password").disabled = false;
    }

    var deco = document.createElement("input");
    deco.id = "deco";
    deco.type = "button";
    deco.value = "Se déconnecter";
    deco.addEventListener("click", disconnect);
    document.getElementsByTagName("body")[0].appendChild(deco);

}