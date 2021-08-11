const router = require('express').Router();
const fs = require('fs');

router.get('/checkauth', async (req, res) => {
    client.getState().then((data) => {
        console.log(data)
        res.send(data)
    }).catch((err) => {
        if (err) {
            res.send("DISCONNECTED, " + err)
            try {
                fs.unlinkSync('./session.json')
            } catch (err) {
                console.log(err)
            }
        }
    })
});

router.get('/getqr', (req, res) => {
    const qrjs = fs.readFileSync('components/qrcode.js');
    fs.readFile('components/last.qr', (err, last_qr) => {
        fs.readFile('session.json', (serr, sessiondata) => {
            if (err && sessiondata) {
                res.write("<html><body><h2>Already Authenticated</h2></body></html>");
                res.end();
            } else if (!err && serr) {
                const page = `
                    <html>
                        <body>
                            <script>${qrjs}</script>
                            <div id="qrcode"></div>
                            <script type="text/javascript">
                                new QRCode(document.getElementById("qrcode"), "${last_qr}");
                            </script>
                        </body>
                    </html>
                `;
                res.write(page)
                res.end();
            }
        })
    });
});

function deleteQr(res) {
    fs.unlink("components/last.qr", (err) => {
        if (err) {
            res(err.message)
        } else {
            res("last.qr deleted successfully")
        }
    })
}

router.get("/reset/:auth", async (req, res) => {
    const auth = req.params.auth;
    if (auth === process.env.authToken) {
        fs.unlink("./session.json", async (err) => {
            if (err) {
                deleteQr((qr) => {
                    res.status(400).json({
                        "last.qr delete": qr,
                        "session.json delete": err.message
                    })
                })
            } else {
                deleteQr((qr) => {
                    res.status(200).json({
                        "last.qr delete": qr,
                        "session.json delete": "Session.json deleted successfully"
                    })
                })
            }
        })
    }else{
        res.status(410).json({
            "Authentication": "Failed to authenticate",
            "message": "Contact Developer"
        })
    }
})

module.exports = router;