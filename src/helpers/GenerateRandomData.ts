const types = [
    'Organizations',
    'Hubs',
    'Faculty',
    'Programs',
]

export const generateData = num => {
    let nodes = [];
    for (var i = 0; i < num; i++) {
        let name = Math.random().toString(36).replace(/[^a-z]+/g, '').substr(0, Math.random() * 10 + 4);
        let type = types[Math.floor(Math.random() * 4)];
        nodes.push({ name: name, type: type, links: [] });
    }
    for (var j = 0; j < nodes.length; j++) {
        if (Math.random() < .3) {
            let ind = Math.floor(Math.random() * nodes.length);
            if (ind != j)
                nodes[j].links.push(nodes[ind].name);
        }
    }
    return nodes;
}

export default generateData;