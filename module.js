const epsilon = 0.000000000000000000000001
// création de l'objet matrice
function createMatrice(valeurs, a, b, nbA, nbB){
    // a: les quantités disponibles dans les magasins de dépôt respectifs
    // b: les quantités demandées par les magasins de déstination respectifs
    // nbA: le nombre des magasins de dépot
    // nbB: le nombre des magasins de départ
    // valeurs: les valeurs des coûts unitaires à repartir dans la matrice
    let matrice = {};
    if(nbA == a.length && nbB == b.length && nbA*nbB == valeurs.length){
        for(let i = 0, a = 1, b = 1; i < nbA*nbB && a <= nbA && b <= nbB; i++){
            if(b%nbB != 0){
                matrice[`a${a}b${b}`] = valeurs[i];
                b++;
            }else{
                matrice[`a${a}b${b}`] = valeurs[i];
                a++;
                b=1;
            }
        }
    }
    return matrice;
}

// verifie que la somme des quantités disponibles est égale à la somme des quantités demandées
function verifyQuantite(a,b){
    let dispo;
    let demande; 
    try{ 
        dispo = a.reduce((acc, el) => {
            return acc + el;
        }, 0);
        demande = b.reduce((acc, el) => {
            return acc + el;
        }, 0);
        if(dispo === demande){
            console.log(`\nLa somme des quantités disponibles(${dispo}) est égale à la somme des quantités demandées(${demande})`);;
        }
        else{
            throw new Error(`a = ${dispo} et b = ${demande}`);
        }
    }
    catch(err){
        console.error(err)
    }
}

// génère la solution de base
function generateBaseSolution(tabIndex, matrice, a, b, maxiOfTab){
    const {Graph} = require('./Graph.js');
    let miniOfTab
    let indexOfMiniOfTab;
    let newValueOfMatrice; //evolution des valeurs dans la matrice
    let baseSolution = {};
    let qteDispo;
    let qteDemande;
    newValueOfMatrice = Object.values(matrice)
    miniTab = Math.min(...newValueOfMatrice);
    
    let stop = false;
    while(!stop){
        for(let i = 0; i < tabIndex.length; i++){
            if(matrice[`${tabIndex[i]}`] != miniOfTab){
                continue;
            }else{
                indexOfMiniOfTab = tabIndex[i];
                break;
            }
        }
        
        if(indexOfMiniOfTab){
            const aId = parseInt(indexOfMiniOfTab.slice(1,2));  // retourne la valeur de l'index de a corresondant à l'emplacement du miniOfTab ex: a2b3 => aId = 2
            const bId = parseInt(indexOfMiniOfTab.slice(3,4));  // retourne la valeur de l'index de b corresondant à l'emplacement du miniOfTab ex: a2b3 => bId = 3
            if(a[aId-1] < b[bId-1]){
                baseSolution[`a${aId}b${bId}`] = a[aId-1];
                b[bId-1] = b[bId-1] - a[aId-1];
                a[aId-1] = 0;
                tabIndex.forEach(index => {
                    if(index.slice(0,2)==`a${aId}`){
                        matrice[index] = Infinity;
                    }
                })
            }else if(a[aId-1] > b[bId-1]){
                baseSolution[`a${aId}b${bId}`] = b[bId-1];
                a[aId-1] = a[aId-1] - b[bId-1];
                b[bId-1] = 0;
                tabIndex.forEach(val => {
                    if(val.slice(2,4)==`b${bId}`){
                        // matrice[`${val}`]=maxiOfTab;
                        matrice[`${val}`]=Infinity;
                    }
                })
            }else{
                baseSolution[`a${aId}b${bId}`] = a[aId-1];
                a[aId-1] = b[bId-1] = 0;
                tabIndex.forEach(index => {
                    if(index.slice(0,2)==`a${aId}` || index.slice(2,4)==`b${bId}`){
                        // matrice[index] = maxiOfTab;
                        matrice[index] = Infinity;
                    }
                })
            }
        }

        newValueOfMatrice = Object.values(matrice);
        miniOfTab = Math.min(...newValueOfMatrice);

        qteDispo = a.reduce((acc, el) => {
            return acc + el;
        }, 0);
        qteDemande = b.reduce((acc, el) => {
            return acc + el;
        }, 0);

        if(qteDispo == 0 && qteDemande == 0) stop=true
        else continue
    }

    // return baseSolution;

    const graph = new Graph();
    Object.keys(baseSolution).forEach(key => {
        graph.addEdge(key.slice(0,2), key.slice(2,4));
    })
    console.log('cas dégénéré?: ', graph.isConnected() ? 'non' : 'oui');
    if(graph.isConnected()){
        return baseSolution;
    }else{
        const connectedComponents = graph.findConnectedComponents();
        console.log('Composantes connexes: ', connectedComponents);
        let fooEdge = {};
        let head = '';
        for(let i = 0; i < connectedComponents.length; i++){
            // if(i==0){
            //     connectedComponents[i].forEach(key => {
            //         if(key.slice(0,1)=='a'&&head==''){
            //             head += key;
            //         }
            //     })
            // }else{
            //     connectedComponents[i].forEach(key => {
            //         if(key.slice(0,1)=='b' && head!=''){
            //             head += key;
            //             baseSolution[`${head}`] = epsilon;
            //             head = '';

            //         }
            //     })
            // }
            if(head==''){
                    connectedComponents[i].forEach(key => {
                        if(key.slice(0,1)=='a'&&head==''){
                            head += key;
                        }
                    })
            }else{
                connectedComponents[i].forEach(key => {
                    if(key.slice(0,1)=='b'&&head!=''){
                        head += key;
                        baseSolution[`${head}`] = epsilon;
                        head = '';
                    }

                    
                })
                
                if(i<(connectedComponents.length-1)){

                    connectedComponents[i].forEach(key => {
                        if(key.slice(0,1)=='a'&&head==''){
                            head += key;
                        }
                    })
                }
            }
        }
        console.log(baseSolution);
        return baseSolution;
    }
}

const generatePotentiels = (baseSolution, matriceOriginal, nbA, nbB) => {
    const {LinkedList} = require('./LinkedList');
    const list = [];
    const potentielsXY = {};
    const nodePotentiel = {};
    for(let i = 1; i <= nbA; i++){
        list[i-1] = new LinkedList();
        list[i-1].append(undefined, `a${i}`);
        const pSIndex = Object.keys(baseSolution);
        pSIndex.forEach(id => {
            if(id.slice(0,2) == `a${i}`){
                potentielsXY[`${id}`] = Number(matriceOriginal[`${id}`]);
                list[i-1].append(undefined, id.slice(2,4));
            }
        })
    }
    const maxPXY = Math.max(...Object.values(potentielsXY));
    let maxId = NaN;
    Object.keys(potentielsXY).forEach(id => {
        if(maxId != NaN && potentielsXY[`${id}`]==maxPXY) maxId = id;
    })
    const source = maxId.slice(0,2);
    list[`${Number(source.slice(1,2))-1}`].insertPotentiel(0, source);
    nodePotentiel[source] = 0;
    Object.keys(potentielsXY).forEach(id => {
        if(source==id.slice(0,2)) {
            list[`${Number(source.slice(1,2))-1}`].insertPotentiel(potentielsXY[id], id.slice(2,4));
            nodePotentiel[id.slice(2,4)] = potentielsXY[id];
        }
    })
    let isPotentielFilled = false;
    while(!isPotentielFilled){
        const nodeWithPotentiel = Object.keys(nodePotentiel);
        for(let i = 0; i < nbA; i++){
            if(list[i].getSourceValue()===undefined){
                list[i].getNextLabels().forEach(index => {
                    if(nodeWithPotentiel.includes(index)){
                        const label = list[i].getSourceLabel();
                        const id = label+index;
                        const potentiel = nodePotentiel[index]-potentielsXY[id];
                        list[i].insertPotentiel(potentiel,label);
                        nodePotentiel[label] = potentiel;
                    }
                })
            } else {
                list[i].getNextLabels().forEach(index => {
                    if(!nodeWithPotentiel.includes(index)){
                        const label = list[i].getSourceLabel();
                        const id = label+index;
                        const potentiel = nodePotentiel[label] + potentielsXY[id];
                        list[i].insertPotentiel(potentiel, index);
                        nodePotentiel[index] = potentiel;
                    }
                })
            }

        }
        if(Object.keys(nodePotentiel).length == nbA + nbB){
            isPotentielFilled = true;
        }   
    }

    const potentiels = [
        nodePotentiel,
        potentielsXY
    ];
    console.log("hehe: ", potentiels)

    return potentiels;
}

const deltaXY = (baseSolution, potentiels, matriceOriginal) => {
    let allDeltas = [];
    const nodePotentiel = potentiels[0];
    const edgePotentiel = potentiels[1];
    Object.keys(matriceOriginal).forEach(index => {
        if(!Object.keys(edgePotentiel).includes(index)){
            const sourceNode = index.slice(0,2);
            const targetNode = index.slice(2,4);
            let delta = nodePotentiel[sourceNode] + matriceOriginal[index] - nodePotentiel[targetNode];
            allDeltas.push({[`${index}`] : delta});
        }
    })

    return allDeltas;
}

const generateOptimalSolution = (baseSolution, deltas, matriceOriginal, nbA, nbB) => {
    let optimalSolution = {};
    let preOptimalSolution = {};
    let fullMatriceBase = {};
    Object.keys(matriceOriginal).forEach(index=> {
        if(Object.keys(baseSolution).includes(index)){
            fullMatriceBase[`${index}`] = baseSolution[index];
        }else{
            fullMatriceBase[`${index}`] = 0;
        }
    });

    let lignes = [];
    let lignesIndex = [];

    for(let i = 0; i < nbA; i++){
        let ligne = []
        let ligneInd = []
        Object.keys(matriceOriginal).forEach(index => {
            let ligneId = 'a'+(i+1);
            if(ligneId == index.slice(0,2)){
                if(Object.keys(baseSolution).includes(index)){
                    ligne.push(baseSolution[index]);
                    ligneInd.push(index);
                }else{
                    ligneInd.push(index);
                    ligne.push(0);
                }
            }
        })
        lignes.push(ligne);
        lignesIndex.push(ligneInd);
    }

    let negativeDeltasIndex = [];
    let negativeDeltasValue = [];
    let chemins = [];
    deltas.forEach(tuple=>{
        if(Object.values(tuple)<0){
            negativeDeltasIndex.push(Object.keys(tuple)[0]);
            negativeDeltasValue.push(Object.values(tuple)[0]);
        }
    })

    //atao anaty boucle manomboka eto
    for(let i = 0; i < negativeDeltasIndex.length; i++){

    let headIndex = negativeDeltasIndex[i];
    let headValue = negativeDeltasValue[i];
    
    let numLigne = indexToCoordinates(headIndex).i;
    let numCol = indexToCoordinates(headIndex).j;
    
    let loopPath = [];
    let trouve = false;
    
    const searchPath = (loopPath, rowNumber, currentIndex) => {
        if(loopPath.length%2!=0 && !trouve){
            loopPath.pop();
        }
        if(loopPath.length == 0 || indexToCoordinates(currentIndex).j == indexToCoordinates(loopPath[`${loopPath.length-1}`]).j){
            if(!trouve){
                loopPath.push(currentIndex);
            }
            let ligne = parcoursLigne(lignes[rowNumber], rowNumber);
            ligne = ligne.filter(id => id != currentIndex);
            if(ligne.length == 0 && !trouve){
                loopPath.pop();
            }else{
                ligne.forEach(id => {
                        if(loopPath.length%2==0 && !trouve){
                            loopPath.pop();
                        }
                        if(indexToCoordinates(id).i == indexToCoordinates(loopPath[`${loopPath.length-1}`]).i){
                            if(!trouve){
                                loopPath.push(id);
                            }
                            let colonneId = indexToCoordinates(id).j;
                            if(!trouve){
                                if(colonneId != numCol){
                                    let colonne = parcoursColonne(lignes, colonneId);
                                    colonne = colonne.filter(index => index != id);
                                    if(colonne.length == 0){
                                        loopPath.pop();
                                    }else{
                                        colonne.forEach(index => {
                                            let ligneId = indexToCoordinates(index).i;
                                            searchPath(loopPath, ligneId, index);
                                            if(!trouve&&loopPath.length%2!=0){
                                                loopPath.pop()
                                            }
                                        })
                                    }
                                } else {
                                    trouve = true;
                                }
                            }
                        }

                        if(!trouve&&loopPath.length%2==0){
                            loopPath.pop();
                        }
                })
            }
        }
    }
   
    searchPath(loopPath, numLigne, headIndex);
   console.log(loopPath);
    let loopMin = Infinity;
    for(let i=1; i < loopPath.length; i=i+2){
        if(fullMatriceBase[loopPath[i]]<loopMin){
            loopMin = fullMatriceBase[loopPath[i]]
        }
    }
    chemins.push({substitue: headIndex, gain: loopMin*headValue, substitueValue: loopMin, chemin: loopPath});
    console.log(chemins);
}

    let gain = 0;
    let cheminPrise = [];
    let substitueValue;
    chemins.map(chemin => {
        if(chemin.gain < gain){
            gain = chemin.gain;
            cheminPrise = chemin.chemin;
            substitueValue = chemin.substitueValue;
        }
    })


    for(let i = 0; i < cheminPrise.length; i++){
        if(i%2!=0){
            fullMatriceBase[cheminPrise[i]] -= substitueValue;
        }else {
            fullMatriceBase[cheminPrise[i]] += substitueValue;
        }
    }
    console.log(fullMatriceBase)
    let ids = Object.keys(fullMatriceBase);

    ids.forEach(id => {
        if(fullMatriceBase[id] != 0){
            optimalSolution[`${id}`] = fullMatriceBase[`${id}`]
        }
    })
    console.log(optimalSolution)
    return optimalSolution;
}

const parcoursLigne = (ligne, numLigne) => {
    const ligneId = 'a'+(Number(numLigne)+1);
    let b;
    let values = []
    for(let i = 0; i<ligne.length; i++){
        b = 'b'+(i+1);
        const index = ligneId + b;
        if(ligne[i]!=0){
            values.push(index);
        }
    }
    return values
}

const parcoursColonne = (ligne, numColonne) => {
    const colonneId = 'b'+(Number(numColonne)+1);
    let a;
    let values = [];
    console.log(ligne)
    for(let i = 0; i<ligne.length; i++){
        a = 'a'+(i+1);
        const index = a + colonneId;
        if(ligne[i][numColonne]!=0){
            values.push(index);
        }
    }
    return values;
}

function indexToCoordinates(idx) {
    // console.log(idx)
    const [, row, col] = idx.match(/a(\d+)b(\d+)/);
    return { i: parseInt(row) - 1, j: parseInt(col) - 1 };
}

function coordinatesToIndex(coord) {
return `a${coord.i + 1}b${coord.j + 1}`;
}

module.exports = {
    createMatrice,
    verifyQuantite,
    generateBaseSolution,
    generatePotentiels,
    deltaXY,
    generateOptimalSolution
}