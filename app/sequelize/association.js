
const preloadAssociations = (associations) => {
    if (!associations) {
        return
    }
    let include = [];
    if (!Array.isArray(associations)) {
        associations = [associations]
    }
    for (let assoc of associations) {
        include.push(assoc)
    }
    return { include }
}

module.exports = { preloadAssociations }