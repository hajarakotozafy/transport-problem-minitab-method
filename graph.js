class Graph {
  constructor() {
    this.adjList = new Map();
  }

  addEdge(start, end) {
    if (!this.adjList.has(start)) {
      this.adjList.set(start, []);
    }
    this.adjList.get(start).push(end);

    if (!this.adjList.has(end)) {
      this.adjList.set(end, []);
    }
    this.adjList.get(end).push(start);
  }

  isConnected() {
    const visited = new Set();
    const startVertex = this.adjList.keys().next().value;
    const queue = [startVertex];
    visited.add(startVertex);

    while (queue.length > 0) {
      const vertex = queue.shift();
      const neighbors = this.adjList.get(vertex);
      if(neighbors){
        for (const neighbor of neighbors) {
          if (!visited.has(neighbor)) {
            visited.add(neighbor);
            queue.push(neighbor);
          }
        }
      }
    }

    return visited.size === this.adjList.size;
  }

  dfsUtil(vertex, visited, component) {
    visited.add(vertex);
    component.push(vertex);

  const neighbors = this.adjList.get(vertex);
    if(neighbors){
      for (const neighbor of neighbors) {
        if (!visited.has(neighbor)) {
          this.dfsUtil(neighbor, visited, component);
        }
      }
    }
  }

  findConnectedComponents() {
    const visited = new Set();
    const components = [];

    for (const vertex of this.adjList.keys()) {
      if (!visited.has(vertex)) {
        const component = [];
        this.dfsUtil(vertex, visited, component);
        components.push(component);
      }
    }

    return components;
  }


}

// Création du graphe
const graph = new Graph();

// Ajout des arêtes du graphe
graph.addEdge('a1', 'b2');
graph.addEdge('a1', 'b5');
graph.addEdge('a2', 'b4');
graph.addEdge('a3', 'b1');
graph.addEdge('a3', 'b3');
graph.addEdge('a3', 'b4');
graph.addEdge('a3', 'b5');
graph.addEdge('a4', 'b5');

// Vérification si le graphe est connexe
const isConnected = graph.isConnected();
console.log('Graphe connexe:', isConnected);

// Recherche des composantes connexes
const connectedComponents = graph.findConnectedComponents();
console.log('Composantes connexes:', connectedComponents);