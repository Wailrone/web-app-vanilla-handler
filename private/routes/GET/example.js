const fs = require('fs')
const Route = require('../../structure/route.js')

class AppModule extends Route {
    run(req, res) {
        res.writeHead(200, { 'Content-Type': 'text/html' })
        res.write(fs.readFileSync('./public/views/example.html', 'utf-8'))
        res.end()
    }
}

module.exports = new AppModule()