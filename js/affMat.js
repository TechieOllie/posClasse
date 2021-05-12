// Affichage des matières
function afficherMatiere(matieres, effectif, reponse, tr) {
    // Création des tableaux
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
    }

    console.log("trimestre", tr)
    console.log(discipline);

    // Pour calculer ensuite l'évolution moyenneG
    var notesTimestamp = [];
    var dateMtn = new Date();

    for (k = 0; k < reponse.data.notes.length; k++) {
    	if (!isNaN(parseFloat(reponse.data.notes[k].valeur)) && !reponse.data.notes[k].nonSignificatif) { // Verif si y'a bien une note et pas absent
    		notesTimestamp.push(dateMtn - new Date(reponse.data.notes[k].dateSaisie.split("-")));
    	}

    	else {
    		notesTimestamp.push(dateMtn-0);
    	}
    }

    var derniereNoteG = reponse.data.notes[notesTimestamp.indexOf(Math.min(...notesTimestamp))];
    console.log(derniereNoteG);
    
    // Classement des moyennes
    var listeDevoirs = reponse.data.notes;
    var nDerniereNote = [0, listeDevoirs[0]]; // Dernière note rentrée pour calculer évolution moyenneG
    var tableauDevoirs = {}; // Contient par matière les notes, surX et le coeff pour chaque valeur

    for (x of listeDevoirs) { // Parcourt la liste de toute les note rentrées
        if (tr != 2 ? (x.codePeriode == "A00"+(tr+1) && !x.nonSignificatif) : true) { // Test si bon semestre + si c'est significatif
            if (tableauDevoirs[x.libelleMatiere] == undefined) { // Nouvelle matière
                tableauDevoirs[x.libelleMatiere] = [];
                if (!isNaN(parseFloat(x.valeur))) { // Verif si il y a bien une note
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
    var ancienMoyenneG = 0;
    var sommeCoeffMatiere = 0;

    // Affichage lignes après lignes des trois colonnes
    for (i = 0; i < matieres.length; i++) {
        var newTable = document.createElement("tr");
        document.getElementById("table").appendChild(newTable);

        // Disciplines
        var newTableD = document.createElement("td");
        newTableD.innerText = matieres[i].discipline;
        document.getElementsByTagName("tr")[i + 1].appendChild(newTableD);

        // Moyennes
        var newTableN = document.createElement("td");
        newTableN.innerText = "/";

        document.getElementsByTagName("tr")[i + 1].appendChild(newTableN);

        // Affichage progression
        var newTableP = document.createElement("td");
        var differenceNote = document.createElement("p");
        differenceNote.style.margin = 0;
        differenceNote.style.fontWeight = "bold";
        newTableP.style = "background-size: 18%; background-repeat: no-repeat; background-position: center;"
        var moyenneNotes = 0;
        var sommeCoeff = 0;
        var sommeNotes = 0;
        var derniereMoyenne = -1;
        var derniereNote = -1;
        var diffMoyenne = 0;

        if (tableauDevoirs[matieres[i].discipline] != undefined && tableauDevoirs[matieres[i].discipline].length > 0) { // Vérifie si la matière existe et si il y'a bien eu une note dans le semestre
            var nbNotes = tableauDevoirs[matieres[i].discipline].length;
            for (chaqueNote of tableauDevoirs[matieres[i].discipline]) {
                sommeNotes += (chaqueNote[0] / chaqueNote[1]) * chaqueNote[2];
                sommeCoeff += chaqueNote[2];
            }

            moyenneNotes = Math.round(sommeNotes / sommeCoeff * 2000) / 100;
            moyenneGen += moyenneNotes * parseFloat(matieres[i].coef);

            if (matieres[i].discipline == derniereNoteG.libelleMatiere) {
            	// Ajoute à la moyenne générale le calcul de la moyenne de la matière où il y a eu la dernière note rentrée, mais sans la compter
            	ancienMoyenneG += (Math.round((sommeNotes-(parseFloat(derniereNoteG.valeur.replace(",", ".")) / parseFloat(derniereNoteG.noteSur.replace(",", ".")) * parseFloat(derniereNoteG.coef.replace(",", ".")))) / (sommeCoeff-parseFloat(derniereNoteG.coef.replace(",", "."))) * 2000) / 100) * parseFloat(matieres[i].coef);
            }

            else {
            	ancienMoyenneG += moyenneNotes * parseFloat(matieres[i].coef);
            }


            // Comparaison de moyennes et affichage de la progression
            if (nbNotes >= 2) {
                derniereNote = tableauDevoirs[matieres[i].discipline][nbNotes-1];
                derniereMoyenne = Math.round((sommeNotes-derniereNote[0]/derniereNote[1]*derniereNote[2]) / (sommeCoeff-derniereNote[2]) * 2000) / 100;
                diffMoyenne = Math.round((moyenneNotes-derniereMoyenne)*100)/100;
            	
            	if (diffMoyenne > 0) {
            		differenceNote.innerText = "+";
            		differenceNote.style.color = "#5aa03c";
            	}

            	else if (diffMoyenne < 0) {
            		differenceNote.style.color = "#c1312a";
            	}

            	else {
            		differenceNote.style.color = "#93d7ff";
           		}
            }

            else {
            	differenceNote.style.color = "#93d7ff";
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
            sommeCoeffMatiere += parseFloat(matieres[i].coef);
        } 

        else {
        	diffMoyenne = "/";
            moyenneNotes = "/"; // Sinon, affiche un slash
        }

        newTableN.innerText = moyenneNotes;
        differenceNote.innerText += diffMoyenne;

        document.getElementsByTagName("tr")[i + 1].appendChild(newTableP);
        document.getElementsByTagName("td")[3*i+2].appendChild(differenceNote);
    }

    // Affichage pour moyenne notes
    var newTable = document.createElement("tr");
    document.getElementById("table").appendChild(newTable);

    var newTableD = document.createElement("td");
    newTableD.style = "font-weight: bold";
    newTableD.innerText = "Moyennes";
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableD);

    var newTableN = document.createElement("td");
    var moyenneFinale;
    if (moyenneGen != 0 && sommeCoeffMatiere != 0) {
    	moyenneFinale = Math.round(moyenneGen / sommeCoeffMatiere * 100) / 100;
        newTableN.innerText = moyenneFinale;
    }
    else {
        newTableN.innerText = "/";
    }
    newTableN.style = "font-weight: bold";
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableN);


    // Affichage pour progression moyenne
   	var newTableP = document.createElement("td");
   	newTableP.style = "font-weight: bold; background-size: 18%; background-repeat: no-repeat; background-position: center;"

    //document.getElementById("table").appendChild(newTableP);
    var ancienneMoyenneFinale;
    if (ancienMoyenneG != 0 && sommeCoeffMatiere != 0) {
    	ancienneMoyenneFinale = Math.round(ancienMoyenneG / sommeCoeffMatiere * 100) / 100;
		if (ancienneMoyenneFinale < moyenneFinale) {
		   newTableP.innerText = "+";
           newTableP.style.color = "#5aa03c";
        }
                    
        else if (ancienneMoyenneFinale > moyenneFinale) {
        	newTableP.style.color = "#c1312a";
        }

        else {
        	newTableP.style.color = "#93d7ff";
        }
    }

    else {
    	newTableP.innerText = "/";
    }

    newTableP.innerText += Math.round((moyenneFinale-ancienneMoyenneFinale)* 100) / 100;
    document.getElementsByTagName("tr")[i + 1].appendChild(newTableP);

    // Légende des couleurs notes
    var bar = document.createElement("img");
    bar.id = "bar";
    bar.src = "img/bar.png";
    document.getElementsByTagName("body")[0].appendChild(bar);

    // Message mise à jour notes
    var maj = document.createElement("p");
    maj.style = "font-style: italic;";

    console.log(notesTimestamp); // Stocke la différence de timestamp entre le moment de la saisie et ajd pour chaque note
    
    maj.innerText = "Dernière mise à jour des notes le : " + reponse.data.notes[notesTimestamp.indexOf(Math.min(...notesTimestamp))].dateSaisie+".";
    maj.style = "font-style: italic;";
    document.getElementsByTagName("body")[0].appendChild(maj);

    function disconnect() {
        localStorage.clear();
        cookie = false;

        document.getElementById("login").value = "";
        document.getElementById("password").value = "";

        document.getElementsByTagName("p")[document.getElementsByTagName("p").length-1].remove();
        document.getElementsByTagName("table")[0].remove();
        document.getElementById("deco").remove();
        document.getElementById("bar").remove();

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