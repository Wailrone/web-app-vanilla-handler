const { resolve } = require('path')
const recursive = require("recursive-readdir");

module.exports = class RoutesLoader {
    constructor(methods) {
        this.methods = methods
        this.routes = {
            "GET": new Map(),
            "POST": new Map(),
        }
    }

    getRoute(method, endpoint) {
        return this.routes[method].get(endpoint)
    }

    addRoutes(method, pathOfFile) {
        let splitedPathOfFile = pathOfFile.includes('/') ? pathOfFile.split('/') : pathOfFile.split('\\')
        splitedPathOfFile.splice(0, splitedPathOfFile.indexOf(method) + 1)
        this.routes[method].set(splitedPathOfFile.join('/').slice(0, -3), require(pathOfFile));
    }

    loadRoutes() {
        for (const method of this.methods) {
            recursive(resolve(__dirname, "..", "routes", method), (err, files) => {
                if (err) console.log(err)
                else for (const file of files) {
                    this.addRoutes(method, file)
                }
            });
        }
    }
}
