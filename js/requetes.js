function auth() {
    // Récupération des identifiants si pas dans le localStorage
    if (cookie == false) {
        login = document.getElementById("login").value;
        password = document.getElementById("password").value;
    }
    
    // On retire le tableau si besoin est
    if (document.getElementsByTagName("p")[0] != undefined) {
        document.getElementsByTagName("p")[0].remove();
    }
    if (document.getElementsByTagName("table")[0] != undefined) {
        document.getElementsByTagName("table")[0].remove();
    }
    if (document.getElementById("deco") != undefined) {
        document.getElementById("deco").remove();
    }

    // Pour empêcher les singes de spammer le bouton ou les champs
    document.getElementById("button").disabled = true;
    document.getElementById("login").disabled = true;
    document.getElementById("password").disabled = true;

    // Création de la variable pour le trimestre demandé par l'utilisateur
    if (document.getElementById("tr0")) {
        for (i = 0; i < document.getElementsByTagName("no").length; i++) {
            if (document.getElementById("tr" + i).checked) {
                trUser = i;
                console.log("trUser", trUser)
            }
        }
    } else {
        trUser = -1;
    }

    // On retire les cases à cocher
    if (document.getElementsByTagName("no")[0] != undefined) {
        u = 0;
        while (u < 3) {
            document.getElementsByTagName("no")[0].remove();
            document.getElementsByName("Trimestre")[0].remove();
            document.getElementsByTagName("br")[5].remove(); // Très relatif, à changer si d'autres <br> ajouté
            u++;
        }
    }

    // Données JSON à envoyer
    data = {
        "identifiant": login,
        "motdepasse": password
    }

    // Création + envoi de la requête
    var http = new XMLHttpRequest();
    http.open("POST", "https://api.ecoledirecte.com/v3/login.awp", true);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send("data=" + JSON.stringify(data));

    // Récupération des données de la requête du login
    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            var reponse = JSON.parse(http.responseText);
            var token = reponse.token;
            var message = reponse.message;
            if (document.getElementsByTagName("test")[0] == null) {
                var msgAfficher = document.createElement("test");
                document.getElementsByTagName("body")[0].appendChild(msgAfficher);
            }

            // Affichage de la photo de profil
           /* var lien = reponse.data.accounts[0].profile.photo;
            document.getElementById("photoUser").src = "https://"+lien.substr(2);*/


            // Si pas d'erreur lancement de la 2e requête
            console.log(message);
            document.getElementById("button").disabled = false;
            if (message == "") {
                var idEleve = reponse.data.accounts[0].id;
                recupererNote(token, idEleve);
                enregistrer(login, password);
                //log(login);
                document.getElementsByTagName("test")[0].innerText = "Chargement...";
            }

            // Si erreur affichage du message d'erreur
            else {
                document.getElementsByTagName("test")[0].innerText = message;
                document.getElementById("login").disabled = false;
                document.getElementById("password").disabled = false;
            }
        }
    }
}


function recupererNote(token, idEleve) {
    // Envoi du token pour la 2e requête
    data = {
        "token": token
    }

    // 2e requête
    var http = new XMLHttpRequest();
    http.open("POST", "https://api.ecoledirecte.com/v3/eleves/" + idEleve + "/notes.awp?verbe=get&", true);
    http.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    http.send("data=" + JSON.stringify(data));

    http.onreadystatechange = function() {
        if (http.readyState == 4 && http.status == 200) {
            document.getElementsByTagName("test")[0].remove();
            var reponse = JSON.parse(http.responseText);
            if (trUser == -1) {
                tr = defautTriOuSem(reponse.data.periodes);
                console.log("tr par défaut utilisé")
            } else if (trUser != -1) {
                tr = trUser;
                console.log("tr rentré par l'utilisateur utilisé")
            }
            console.log("tr pour req", tr);
            var matieres = reponse.data.periodes[tr].ensembleMatieres.disciplines;
            var effectif = reponse.data.periodes[0].ensembleMatieres.disciplines[0].effectif;
            afficherPeriodes(reponse)
            afficherMatiere(matieres, effectif, reponse, tr);
        }
    }
}