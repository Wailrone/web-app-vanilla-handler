const Route = require('../../structure/route.js')

class AppModule extends Route {
    async run(req, res) {
        let data = await this.app.functions.getReqData()
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify({
            data: data,
        }))
    }
}

module.exports = new AppModule()