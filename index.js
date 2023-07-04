/** Les données */
// EXEMPLE LECON
// const nbA = 4;//ligne
// const nbB = 6;//colonne
// const valeurs = [24,22,61,49,83,35,23,39,78,28,65,42,67,56,92,24,53,54,71,43,91,67,40,49];
// const a = [18,32,14,9];
// const b = [9,11,28,6,14,5];

// TD 07
// const nbA = 4;
// const nbB = 6;
// const valeurs = [9,12,9,6,9,10,7,3,7,7,5,5,6,5,9,11,3,11,6,8,11,2,2,10];
// const a = [50,60,20,90];
// const b = [40,30,70,20,40,20];

// TD 08
const nbA = 4;
const nbB = 5;
const valeurs = [21,11,84,49,13,27,52,43,29,42,11,47,14,80,93,52,14,76,74,54];
const a = [896,782,943,928];
const b = [800,439,50,790,1470];

// TD 09
// const nbA = 4;
// const nbB = 6;
// const valeurs = [45,60,15,30,45,40,35,15,10,35,25,5,20,15,45,55,10,55,30,40,55,10,10,50];
// const a = [25,30,10,45];
// const b = [20,15,35,10,20,10];

// EXEMPLE DE CAS DEGENERE LECON
// const nbA = 4;
// const nbB = 6;
// const valeurs = [45,60,45,30,45,50,35,15,35,35,25,25,30,25,45,55,15,55,30,40,55,10,10,50];
// const a = [25,30,10,45];
// const b = [20,15,35,10,20,10];

/** =============== GENENRATE BASE SOLUTION =============== */

const {createMatrice, verifyQuantite, generateBaseSolution, generatePotentiels, deltaXY, generateOptimalSolution} = require('./module');
let matrice = {};
let baseSolution = {};
let matriceOriginal = {};
let index = [];

matrice = createMatrice(valeurs, a, b, nbA, nbB);
matriceOriginal = {...matrice};
index = Object.keys(matrice);

const c = [...a];
const d = [...b];
console.log("\nLes quantités disponibles dans les magasins de dépôt: \n", c);
console.log("\nLes quantités de demandes dans les magasins de déstination: \n", d);
verifyQuantite(a,b);

let max = Math.max(...valeurs)+1;
max = Infinity; //remplacer le min du tab par infini
baseSolution = generateBaseSolution(index, matrice, a, b, max);


/** ==========  FORMULATION DE LA SOLUTION DE BASE ========== */
/** ==========  PAS IMPORTANT(juste affichage pour la console) ========== */

console.log("\nLes coûts unitaires de transport: \n", JSON.stringify(matriceOriginal));

console.log("\n\n=> x(i,j):", baseSolution);
const pSIndex = Object.keys(baseSolution);
console.log("\n\n=> La solution de base est:");
for(let i = 1; i <= a.length ;i++){
    pSIndex.forEach(id => {
        if(id.slice(0,2) == `a${i}`){
            // console.log(`a${i} ----> ${id.slice(2)}`);
            console.log(`a${i} --${matriceOriginal[id]}--> ${id.slice(2)}`);
        }
    })
}

const z = pSIndex.reduce((acc, el) =>
{
    return acc + matriceOriginal[`${el}`]*baseSolution[`${el}`];
},0);
console.log("\n=> Dont le coût total de transport est de:", z);

/** =============== GENERATE OPTIMAL SOLUTION =============== */
// Trouver les potentiels Vx, C(x,y), Vy

const potentiels = generatePotentiels(baseSolution,matriceOriginal, nbA, nbB);
console.log('potentiels des sommets => ',potentiels[0]);
console.log('potentiels des arcs => ', potentiels[1]);

// Calculer Delta(x,y) = Vx + C(x,y) - Vy pour les cases vides c-a-d les couts marginaux

const deltas = deltaXY(baseSolution, potentiels, matriceOriginal);
console.log('couts marginaux => ', deltas);
// Tant qu'il existe Delta(x,y) < 0 => substitution de vecteur et refaire les étapes

const optimalSolution = generateOptimalSolution(baseSolution,deltas,matriceOriginal,nbA,nbB);
console.log('solution optimal => ', optimalSolution);