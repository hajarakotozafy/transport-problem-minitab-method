class Node {
    constructor(value, label) {
        this.label = label;
        this.value = value;
        this.next = null;
    }
}


class LinkedList {
    constructor() {
        this.head = null;
        this.size = 0;
    }

    isEmpty() {
        return this.size === 0;
    }

    getSize() {
        return this.size;
    }

    getSourceValue(){
        return this.head.value;
    }

    getSourceLabel(){
        return this.head.label;
    }

    append(value, label) {
        const node = new Node(value, label);
        if (this.isEmpty()) {
            this.head = node;
        } else {
            let prev = this.head;
            while (prev.next) {
                prev = prev.next;
            }
            prev.next = node;
        }
        this.size++;
    }
    insertPotentiel(value, label) {
        if (this.isEmpty()) {
            return -1
        }
        let curr = this.head;
        while (curr) {
            if (curr.label == label) {
                curr.value = value;
            }
            curr = curr.next;
        }
        return -1
    }

    getNextLabels() {
        let labels = [];
        let curr = this.head.next;
        while(curr){
            labels.push(curr.label);
            curr = curr.next;
        }
        return labels;
    }

    print() {
        if (this.isEmpty()) {
            console.log("The list is empty");
        } else {
            let curr = this.head;
            let listValues = '';
            while (curr) {
                listValues += `${curr.value} `;
                curr = curr.next;
            }
            console.log(listValues);
        }
    }
}

module.exports = {
    LinkedList,
}