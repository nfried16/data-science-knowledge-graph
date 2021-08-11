const getRow = (nodenum: number) => {
    return Math.ceil((1 + Math.sqrt(1 - 4 * (1 - nodenum))) / 2);
}

const getNodesRow = (row: number) => {
    if (row == 1)
        return 1;
    return (row - 1) * 2;
}

export interface Position {
    x: number,
    y: number
}

export const getRandomPositions = nodes => {
    // Get amount of each type
    let amounts = {
        'Hubs': 0,
        'Programs': 0,
        'Organizations': 0,
        'Faculty': 0,
    }
    nodes.forEach(node => {
        amounts[node.type]++;
    })
    // Setting up layout of nodes
    const allrows = {
        'Hubs': getRow(amounts['Hubs']),
        'Programs': getRow(amounts['Programs']),
        'Organizations': getRow(amounts['Organizations']),
        'Faculty': getRow(amounts['Faculty']),
    }
    const rows = Math.max(...Object.values(allrows));
    let tot = (rows - 1) * (rows - 2) + 1;
    let lastrows = {
        'Hubs': tot,
        'Programs': tot,
        'Organizations': tot,
        'Faculty': tot,
    }
    let last = {
        'Hubs': amounts['Hubs'] - tot,
        'Programs': amounts['Programs'] - tot,
        'Organizations': amounts['Organizations'] - tot,
        'Faculty': amounts['Faculty'] - tot,
    }
    Object.keys(last).forEach(lam => {
        if (last[lam] < 0) {
            last[lam] = getNodesRow(rows - 1) + last[lam];
            lastrows[lam] = (rows - 2) * (rows - 3) + 1;
        }
    })
    // Create Clusters
    let allpos: Position[] = [];
    let curr = {
        'Hubs': 1,
        'Programs': 1,
        'Organizations': 1,
        'Faculty': 1,
    }
    let base = {
        'Faculty': 0,
        'Programs': Math.PI / 2,
        'Organizations': Math.PI,
        'Hubs': 3 * Math.PI / 2,
    }
    for (var n = 0; n < nodes.length; n++) {
        let row = getRow(curr[nodes[n].type]);
        let r = 100 * row / (allrows[nodes[n].type] / rows);
        let currinrow = row * (row - 1) + 2 - curr[nodes[n].type];
        let a = 0;
        if (curr[nodes[n].type] > lastrows[nodes[n].type]) {
            currinrow = amounts[nodes[n].type] - curr[nodes[n].type] + 1;
            a = base[nodes[n].type] + currinrow * ((Math.PI / 2) / (last[nodes[n].type] + 1));
        }
        else
            a = base[nodes[n].type] + currinrow * ((Math.PI / 2) / (getNodesRow(row) + 1));
        allpos.push({ x: 1.75 * r * Math.cos(a) + Math.random() * 100 - 50, y: r * Math.sin(a) + Math.random() * 80 - 40 })
        curr[nodes[n].type]++;
    }
    /*
    // For Circle Layout
    let t = 0;
    let c = 1;
    while(t < ret.length) {
        let r = 120*(c-1);
        for(var i = 0; i < Math.pow(c, 2); i++) {
            if(t + i > ret.length)
                break;
            let a = 2*Math.PI/Math.pow(c, 2)*i;
            allpos.push({x: 1.5*r*Math.cos(a) + Math.random()*100-50, y: r*Math.sin(a) + Math.random()*100-50});
        }
        t = t+i;
        c++;
    }*/
    return allpos;
}

export default getRandomPositions;