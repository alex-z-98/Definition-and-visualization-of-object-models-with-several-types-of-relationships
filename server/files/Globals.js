Global = {
    w: 10000,
    h: 10000,
    wsize: 100,
    hsize: 60,
    infow: 100,
    current: undefined,
    currentlvl: undefined,
    linkFlag: false,
    LinkFilter: undefined,
    images: ["block.png", "comut.png", "energy.png", "server.png", "blade2.jpg", "disk.jpg", "NetCol8000.jfif", "IBcomut.jfif", "pool.png", "comut1.png", "rect.png"],
    types: ["Ethernet", "InfiniBand",],
    StartingPoint: {},
    MousePoint: {},
    Mouse:{x:0, y:0},
    SelectedBuffer: undefined,
    SelectedLvl: undefined,
    SelectedLayer: undefined,
    preMODEL:{
        elems:undefined,
        lines:undefined
    }, 
    preMODELlvl: undefined, 
    preMODELnode: undefined,
    MODEL:undefined,
    tmpl: {
        preamble: "n",
        items: ["rack", "Pool", "index"],
        len: [2, 1, 3]
    }
}