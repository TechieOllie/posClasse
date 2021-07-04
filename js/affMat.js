// Affichage des matières
function afficherMatiere(matieres, effectif, reponse, tr) {
    // On autorise la plèbe à rappuyer sur les boutons
    document.getElementById("button").disabled = false;

    // Création des tableaux
    discipline = [];

    // Tableau des moyennes des notes pour le graph
	Graph_Data = [];

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

    console.log("trimestre", tr);
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
    
    // Classement des moyennes
    var listeDevoirs = reponse.data.notes;
    var nDerniereNote = [0, listeDevoirs[0]]; // Dernière note rentrée pour calculer évolution moyenneG
    var tableauDevoirs = {}; // Contient par matière les notes, surX et le coeff pour chaque valeur
    var NbTr = reponse.data.periodes.length;

    console.log(listeDevoirs);
    console.log(NbTr);

    for (x of listeDevoirs) { // Parcoure la liste de toute les note rentrées
        if (tr != (NbTr-1) ? (x.codePeriode == "A00"+(tr+1) && !x.nonSignificatif) : !x.nonSignificatif) { // Test si bon semestre + si c'est significatif
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
    var sommeCoeffAncien = 0;

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
            	if (nbNotes > 1) { // Si il y a plus d'une note de rentrée pour ne pas avoir de division par zéro
            		// Ajoute à la moyenne générale le calcul de la moyenne de la matière où il y a eu la dernière note rentrée, mais sans la compter
            		ancienMoyenneG += (Math.round((sommeNotes-(parseFloat(derniereNoteG.valeur.replace(",", ".")) / parseFloat(derniereNoteG.noteSur.replace(",", ".")) * parseFloat(derniereNoteG.coef.replace(",", ".")))) / (sommeCoeff-parseFloat(derniereNoteG.coef.replace(",", "."))) * 2000) / 100) * parseFloat(matieres[i].coef);
            	}
            	else { // Si la dernière note rentrée est dans une matière ou il n y avait pas de note
            		sommeCoeffAncien -= matieres[i].coef;
            	}
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
            		differenceNote.style.color = "MediumSeaGreen";
            	}

            	else if (diffMoyenne < 0) {
            		differenceNote.style.color = "Red";
            	}

            	else {
            		differenceNote.style.color = "Black";
           		}
            }

            else {
            	differenceNote.style.color = "DodgerBlue";
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
            sommeCoeffAncien += parseFloat(matieres[i].coef);
        } 

        else {
        	diffMoyenne = "/";
            moyenneNotes = "/"; // Sinon, affiche un slash
        }

        newTableN.innerText = moyenneNotes;
        differenceNote.innerText += diffMoyenne;

        document.getElementsByTagName("tr")[i + 1].appendChild(newTableP);
        document.getElementsByTagName("td")[3*i+2].appendChild(differenceNote);

      	// Remplissage de la liste du Graph
		Graph_Data.push(moyenneNotes)
    }

    // Affichage pour moyenne notes
    var newTable = document.createElement("tr");
    document.getElementById("table").appendChild(newTable);

    var newTableD = document.createElement("td");
    newTableD.style = "font-weight: bold";
    newTableD.innerText = "Moyenne";
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

    var ancienneMoyenneFinale;
    if (ancienMoyenneG != 0 && sommeCoeffAncien != 0) {
    	ancienneMoyenneFinale = Math.round(ancienMoyenneG / sommeCoeffAncien * 100) / 100;
		if (ancienneMoyenneFinale < moyenneFinale) {
		   newTableP.innerText = "+";
           newTableP.style.color = "MediumSeaGreen";
        }
                    
        else if (ancienneMoyenneFinale > moyenneFinale) {
        	newTableP.style.color = "Red";
        }

        else {
        	newTableP.style.color = "DodgerBlue";
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

    // Graphique
    var canvas = document.createElement("canvas");
    canvas.id = "myChart";
    canvas.style = "width:360px;margin:auto;text-align:center;"
    document.body.appendChild(canvas);

    var ctx = document.getElementById('myChart').getContext('2d');
    var data = { 
        labels: discipline,
        datasets: [
            {
                fill: true,
                fillOpacity: .1, 
                borderWidth: 4,
                borderColor : "rgb(65, 105, 225,0.7)",
                backgroundColor : "rgb(65, 105, 225,0.2)",
                data: Graph_Data
            }
        
        ]
    }
    var options = {
        layout: {
            padding: 2
        },
        
        plugins: {
            legend: {
                display: false
                }   
        },
        animations: {
            tension: {
                duration: 1000,
                easing: 'easeInElastic',
                from: 0.3,
                to: 0.1,
                loop: true
            }
        },
        scales: {
            r: {
                angleLines: {
                    color: "black"
                },
                grid: {
                    circular:true,
                    color: 'DarkGray'
                },
                pointLabels: {
                    color: '#404040',
                    font: 
                    {
                        size:8
                    }
                },
                ticks: {
                    showLabelBackdrop:false,
                    color: 'RoyalBlue',
                    font: 
                    {
                        size:20
                    }
                
                },
                suggestedMin: 0,
                suggestedMax: 20
            }
        },
        responsive: true,
        legend: false
    }
    var myChart = new Chart(ctx, {
        type: 'radar',
        data: data,
        options: options
    });

    // Message mise à jour notes
    var maj = document.createElement("p");
    maj.style = "font-style: italic;";

    console.log(notesTimestamp); // Stocke la différence de timestamp entre le moment de la saisie et ajd pour chaque note
    
    var msgMaj = reponse.data.notes[notesTimestamp.indexOf(Math.min(...notesTimestamp))];
    maj.innerText = "Dernière note rentrée en "+msgMaj.libelleMatiere+" le : " +msgMaj.dateSaisie+".";
    maj.style = "font-style: italic;";
    document.getElementsByTagName("body")[0].appendChild(maj);

    function disconnect() {
        localStorage.clear();
        cookie = false;

        document.getElementById("login").style.display = "inline";
        document.getElementById("password").style.display = "inline";
        document.getElementById("login").value = "";
        document.getElementById("password").value = "";

        document.getElementsByTagName("p")[document.getElementsByTagName("p").length-1].remove();
        document.getElementsByTagName("table")[0].remove();
        document.getElementById("deco").remove();
        document.getElementById("bar").remove();
        document.getElementById("myChart").remove();

        // On enleve les cases
        if (document.getElementsByTagName("no")[0] != undefined) {
            u = 0;
            let nbCases = document.getElementsByTagName("no").length;
            while (u < nbCases) {
                document.getElementsByTagName("no")[0].remove();
                document.getElementsByName("Trimestre")[0].remove();
                document.getElementsByTagName("br")[5].remove(); // Très relatif, à changer si d'autres <br> sont ajoutés au code
                u++;
            }
        }
    }

    var deco = document.createElement("input");
    deco.id = "deco";
    deco.type = "button";
    deco.value = "Se déconnecter";
    deco.addEventListener("click", disconnect);
    document.getElementsByTagName("body")[0].appendChild(deco);

    // on enlève l'animation chargement
    const btn = document.querySelector("#button");
    btn.classList.remove("button_loading");
}