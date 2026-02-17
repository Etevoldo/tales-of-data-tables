'use strict';

import { items } from "./rerise.11tydata.js"

function findObj(equipName, node) {
    node.name = equipName; 
    node.id = equipName.replace(' ', '-'); //css ids cant have space

    let reriseFromList = items[equipName].ReriseFrom;

    /* base case */
    if (!reriseFromList)
        return;

    node.subNodes = [];

    for (let subNodeName of reriseFromList) {
        let subNode = { name: subNodeName };
        if(items[equipName].Requires) {
            subNode.requires = items[equipName].Requires
        }
        node.subNodes.push(subNode);
        findObj(subNodeName, subNode);
    }
}

function findReriseTree(search) {
    let tree = {};
    findObj(search, tree);

    return tree;
}


document.getElementById("itemSearchBtn").addEventListener("click", (e) => {
    e.preventDefault();

    let searchString = document.getElementById("itemSearchInput").value;

    const notFoundMessage = document.getElementById("notFoundMessage");
    notFoundMessage.style.display = "none";
    //populating Search term in case it doesn't find it
    document.getElementById("searchTerm").textContent = searchString;

    if (!items[searchString]) {
        const message = document.getElementById("notFoundMessage");
        message.style.display = "block";
        return;
    }
    let tree = findReriseTree(searchString);
    renderCyTree(tree);
});

const cy = cytoscape({

    container: document.getElementById('cy'), // container to render in

    style: [ // the stylesheet for the graph
        {
            selector: 'node',
            style: {
                'shape': 'round-rectangle',
                'color': '#FFF',
                'background-color': '#555',
                'content': 'data(id)',
                'label': 'data(caption)',
                'background-fit': 'cover',
                'width': '6em',
                'text-valign': 'center',
                'text-halign': 'center'
            }
        },

        {
            selector: 'edge',
            style: {
                'width': 3,
                'font-size': '0.7em',
                'color': '#FFF',
                'line-color': '#ccc',
                'label': 'data(requires)',
                'target-arrow-color': '#ccc',
                'target-arrow-shape': 'triangle',
                'curve-style': 'bezier',
            }
        },
    ],

});

/* cytorender */
function renderCyTree(node) {
    cy.elements().remove();
    cy.add({
        data: { 
            id: node.name,
            caption: kebabToTitle(node.name)
        }
    });
    addNode(node);

    const mql = window.matchMedia("(width <= 1200px)");
    const direction = mql.matches ? 'DOWN ': 'RIGHT';
    cy.layout({
        nodeDimensionsIncludeLabels: true,
        name: 'elk',
        elk: {
            'elk.direction': direction
        }
    }).run();

}
function addNode(node) {
    /* base case*/
    if (!node.subNodes) return;
    for (let child of node.subNodes) {
        if (cy.getElementById(child.name).length == 0) {
            cy.add({
                data: { 
                    id: child.name,
                    caption: kebabToTitle(child.name)
                }
            });
        }
        if (cy.getElementById(`${child.name}-${node.name}`).length == 0) {
            cy.add({
                data: {
                    id: `${child.name}-${node.name}`,
                    requires: child.requires ?? '',
                    target: node.name,
                    source: child.name
                }
            });
        }
        addNode(child);
    }
}

function kebabToTitle(str) {
    const regex = /(^\w)|-(\w)/g;
    function replacer(match, offset, string, groups) {
        return match.toUpperCase();
    }
    str = str.replace(regex, replacer);
    str = str.replace('-', ' ');
    return str;
}