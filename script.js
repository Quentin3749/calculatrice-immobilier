// variables
const montantEmprunte = document.getElementById('montant');
const tauxNominal = document.getElementById('taux');
const dureeRemboursement = document.getElementById('durée');
const error = document.getElementById('error');
const calculButton = document.querySelector('.calcul');
const tableauContainer = document.querySelector('.conteneur2');




function validationdonnee (){ 

    const montant = montantEmprunte.value;
    const taux = tauxNominal.value;
    const duree = dureeRemboursement.value;

error.innerHTML = ''; 

if (!montant || isNaN(montant) || !Number.isInteger(Number(montant))) {
    error.innerHTML ="Veuillez remplir tous les champs avec des données valides.";
    error.style.color = 'red';       
}
else if (!taux || isNaN(taux)) {
    error.innerHTML ="Veuillez remplir tous les champs avec des données valides.";
    error.style.color = 'red';      
} 

else if (!duree|| isNaN(duree)||!Number.isInteger(Number(duree)))
{ error.innerHTML ="Veuillez remplir tous les champs avec des données valides.";
    error.style.color = 'red';     
}

else { 
    error.innerHTML = '';  // Réinitialiser l'erreur s'il n'y a pas de problème
    calculEcheanceEtAmortissement (Number(montant ),Number(taux),Number(duree));
}

}


function calculEcheanceEtAmortissement(montant, taux, duree) {
        const tableau = document.querySelector('tbody');
        tableau.innerHTML = ''; // Réinitialiser le tableau
        duree = duree * 12; 
        console.log (duree);

       // Calcul du taux d'intérêt mensuel
const tauxMensuel = (taux / 12) / 100;

// Calcul de l'échéance mensuelle
const echeanceMensuelle = montant * ((tauxMensuel * Math.pow(1 + tauxMensuel, duree)) / (Math.pow(1 + tauxMensuel, duree) - 1));

let montantRestant = montant;

// Pour chaque mois, calcul des intérêts et de l'amortissement
for (let mois = 1; mois <= duree; mois++) {
    // Calcul des intérêts du mois
    const interetDuMois = montantRestant * tauxMensuel;

    // Calcul de l'amortissement du mois
    const amortissement = echeanceMensuelle - interetDuMois;

    // Mise à jour du montant restant
    montantRestant -= amortissement;

    // Ajouter une ligne au tableau
    const ligne = `<tr>
        <td>${mois}</td>
        <td>${(montantRestant + amortissement).toFixed(2)} €</td>
        <td>${echeanceMensuelle.toFixed(2)} €</td>
        <td>${interetDuMois.toFixed(2)} €</td>
        <td>${amortissement.toFixed(2)} €</td>
        <td>${montantRestant.toFixed(2)} €</td>
    </tr>`;
    tableau.innerHTML += ligne;
}

         // Afficher le tableau après le calcul
    tableauContainer.style.display = 'flex';
      }

      calculButton.addEventListener('click', validationdonnee);


// Sélection du bouton PDF
const pdfButton = document.querySelector('.PDF');

pdfButton.addEventListener('click', function () {
    // Vérifiez d'abord si le tableau est affiché
    if (tableauContainer.style.display !== 'none') {
        // Capture du tableau en PDF
        html2canvas(document.querySelector('.tableaux')).then((canvas) => {
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jspdf.jsPDF('p', 'pt', 'a4');
            
            // Ajustement de la taille de l'image dans le PDF
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save('Tableau_Amortissement.pdf');
        });
    } else {
        alert('Le tableau doit être généré avant de pouvoir le télécharger.');
    }
});


