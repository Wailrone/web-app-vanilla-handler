
const { readFileSync } = require('fs')
module.exports = class Functions {

    constructor(req, res) {
        this.req = req
        this.res = res
    }

    createError(code) {
        switch (code) {
            default:
                this.createError(404)
                break;
            case 404:
                if (this.req.method === "GET") {
                    this.res.writeHead(404, { "Content-Type": "text/html" });
                    this.res.write(readFileSync('./public/views/404.html', 'utf-8'))
                    this.res.end()
                } else if (this.req.method === "POST") {
                    this.res.writeHead(404, { "Content-Type": "application/json" });
                    this.res.end(JSON.stringify({
                        status: 404,
                        message: "404 This request is not allowed here."
                    }))
                }
                break;
            case 400:
                this.res.writeHead(400, { "Content-Type": "application/json" });
                this.res.end(JSON.stringify({
                    status: 400,
                    message: "400 Bad request."
                }))
                break;
        }
    }

    getReqData() {
        return new Promise((resolve) => {
            let data = "";
            this.req.on("data", (chunk) => {
                data += chunk;
            });
            this.req.on("end", () => {
                try {
                    resolve(JSON.parse(data));
                }
                catch (e) {
                    this.createError(400)
                }
            });
        });
    }
}
