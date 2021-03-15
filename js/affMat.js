// Affichage des matières
function afficherMatiere(matieres, effectif, reponse, tr) {
    // Création des tableaux
    rang = [];
    discipline = [];

    // Variable pour fin tri/semestre
    let finEcheance;
    if (typeof reponse.data.periodes[tr].dateConseil != "undefined") {
        finEcheance = new Date(reponse.data.periodes[tr].dateConseil);
    }
    else {
    	finEcheance = new Date(reponse.data.periodes[tr].dateFin);
    }
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

    var moyenneNoteTable = document.createElement("th");
    moyenneNoteTable.id = "moyenneNoteTable";
    moyenneNoteTable.innerText = "Notes";

    var progressionNoteTable = document.createElement("th");
    progressionNoteTable.id = "progressionNoteTable";
    progressionNoteTable.innerText = "Progression";

    document.getElementsByTagName("body")[0].appendChild(table);
    table.appendChild(colonne);

    var column = document.getElementById("column");
    column.appendChild(disciplineTable);
    column.appendChild(moyenneNoteTable);
    column.appendChild(progressionNoteTable);

    // Remplissage du tableau "physique"
    var moyenneGen = 0;
    var rangGen = 0;
    var sommeCoeffMatiere = 0;

    // Affichage lignes après lignes des trois colonnes
    for (i = 0; i < matieres.length; i++) {
        var newTable = document.createElement("tr");
        document.getElementById("table").appendChild(newTable);

        // Disciplines
        var newTableD = document.createElement("td");
        newTableD.innerText = matieres[i].discipline
        document.getElementsByTagName("tr")[i + 1].appendChild(newTableD);

        // Moyennes
        var newTableN = document.createElement("td");
        newTableN.innerText = "/";

        document.getElementsByTagName("tr")[i + 1].appendChild(newTableN);

        // Affichage progression
        var newTableP = document.createElement("td");
        newTableP.style = "font-weight: bold; background-size: 18%; background-repeat: no-repeat; background-position: center;"
        var moyenneNotes = 0;
        var sommeCoeff = 0;
        var sommeNotes = 0;
        var derniereMoyenne = -1;

        if (tableauDevoirs[matieres[i].discipline] != undefined) {
            var nbNotes = tableauDevoirs[matieres[i].discipline].length;
            for (chaqueNote of tableauDevoirs[matieres[i].discipline]) {
                sommeNotes += (chaqueNote[0] / chaqueNote[1]) * chaqueNote[2];
                sommeCoeff += chaqueNote[2];
            }

            moyenneNotes = Math.round(sommeNotes / sommeCoeff * 2000) / 100;
            moyenneGen += moyenneNotes * parseFloat(matieres[i].coef);
            
            // Comparaison de moyennes et affichage de la progression
            if (nbNotes >= 2) {
                derniereNote = tableauDevoirs[matieres[i].discipline][nbNotes-1];
                derniereMoyenne = Math.round((sommeNotes-derniereNote[0]/derniereNote[1]*derniereNote[2]) / (sommeCoeff-derniereNote[2]) * 2000) / 100;
                console.log("testavant", derniereMoyenne, moyenneNotes)
                if (derniereMoyenne < moyenneNotes) {
                    newTableP.style.setProperty("background-image", "url('img/monte.svg')");
                }
                    
                else if (derniereMoyenne > moyenneNotes) {
                    newTableP.style.setProperty("background-image", "url('img/descend.svg')");
                }

                else {
                    newTableP.style.setProperty("background-image", "url('img/constant.svg')");
                }
            }
            else {
                newTableP.style.setProperty("background-image", "url('img/constant.svg')");
            }


            // Couleurs en fonction des notes
            if (moyenneNotes != undefined) {
                if (moyenneNotes >= 19)
                    newTableN.style = "color:White; background-color: Violet ;";
                else if (moyenneNotes >= 17)
                    newTableN.style = "color:White; background-color: DodgerBlue;";
                else if (moyenneNotes >= 14)
                    newTableN.style = "color:White; background-color: MediumSeaGreen;";
                else if (moyenneNotes >= 10)
                    newTableN.style = "color:White; background-color: DarkOrange;";
                else
                    newTableN.style = "color:White; background-color: Red;";
            }


            console.log(derniereMoyenne);

            rangGen += parseFloat(matieres[i].rang) * parseFloat(matieres[i].coef);
            sommeCoeffMatiere += parseFloat(matieres[i].coef);
        } 

        else {
            moyenneNotes = "/"; // Sinon, affiche un slash
        }

        newTableN.innerText = moyenneNotes;

        document.getElementsByTagName("tr")[i + 1].appendChild(newTableP);
    }

    // Affichage pour moyenne notes
    var newTable = document.createElement("tr");
    document.getElementById("table").appendChild(newTable);

    var newTableD = document.createElement("td");
    newTableD.style = "font-weight: bold";
    newTableD.innerText = "Moyennes";
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableD);

    var newTableN = document.createElement("td");
    if (moyenneGen != 0 && sommeCoeffMatiere != 0)
        newTableN.innerText = Math.round(moyenneGen / sommeCoeffMatiere * 100) / 100;
    else
        newTableN.innerText = "/";
    newTableN.style = "font-weight: bold";
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableN);

    // Affichage pour progression moyenne
    var newTableP = document.createElement("td");
    document.getElementById("table").appendChild(newTableP);
    newTableP.style = "font-weight: bold";
    newTableP.innerText = "/";
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableP);

    // Légende des couleurs notes
    var bar = document.createElement("img");
    bar.id = "bar";
    bar.src = "img/bar.png";
    document.getElementsByTagName("body")[0].appendChild(bar);

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