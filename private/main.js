const http = require('http')
const url = require('url')
const { readFileSync } = require('fs')
const { extname } = require('path')
const RoutesLoader = require('./systems/routesLoader')
const Functions = require('./systems/functions')

class App {
    constructor(port, methods) {
        this.port = port
        this.methods = methods
        this.contentTypes = {
            '.html': 'text/html',
            '.js': 'text/javascript',
            '.css': 'text/css',
            '.json': 'application/json',
            '.png': 'image/png',
            '.jpg': 'image/jpg',
            '.gif': 'image/gif',
            '.svg': 'image/svg+xml',
            '.wav': 'audio/wav',
            '.mp4': 'video/mp4',
            '.woff': 'application/font-woff',
            '.ttf': 'application/font-ttf',
            '.eot': 'application/vnd.ms-fontobject',
            '.otf': 'application/font-otf',
            '.wasm': 'application/wasm'
        };
        this.routesLoader = new RoutesLoader(this.methods)
        this.routesLoader.loadRoutes()
        this.initApp()
    }

    async initApp() {
        this.server = http.createServer((req, res) => {
            this.functions = new Functions(req, res)
            this.parsedUrl = url.parse(req.url, true)
            this.parsedUrl.pathArray = this.parsedUrl.pathname.split('/')
            this.parsedUrl.pathArray.shift()
            try {
                if (this.parsedUrl.pathname.startsWith("/public") && req.method === "GET") {
                    try {
                        res.writeHead(200, { 'Content-Type': this.contentTypes[extname(this.parsedUrl.path).toString().toLowerCase()] || 'application/octet-stream' });
                        if (this.parsedUrl.path.endsWith('/')) this.parsedUrl.pathname = this.parsedUrl.pathname.substring(0, this.parsedUrl.pathname.length -1)
                        res.end(readFileSync(`.${this.parsedUrl.pathname}`), 'utf-8');
                    }
                    catch (err) {
                        this.functions.createError(404)
                    }
                }
                else if (this.methods.includes(req.method) && !this.parsedUrl.pathname.includes("/public/")) this.routesLoader.getRoute(req.method, this.parsedUrl.pathname === "/" ? "home" : this.parsedUrl.pathname.substr(1)).run(req, res)
            }
            catch (e) {
                this.functions.createError(404)
            }
        })
        this.server.listen(this.port, () => {
            console.log(`Listening on port ${this.port}`)
        })
    }
}

module.exports = new App(666, ["GET", "POST"])