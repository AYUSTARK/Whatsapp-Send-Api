const router = require('express').Router();

router.post('/sendmessage/:phone', async (req,res) => {
    let phone = req.params.phone;
    let message = req.body.message;
    if (phone === undefined || message === undefined) {
        res.status(400).json({ status:"error", message:"please enter valid phone and message" })
    } else {
        const sanitized_number = phone.toString().replace(/[- )(]/g, ""); // remove unnecessary chars from the number
        const final_number = `91${sanitized_number.substring(sanitized_number.length - 10)}`; // add 91 before the number here 91 is country code of India
        client.getNumberId(final_number).then(resp=>{
            console.log("number_details", resp)
            if(resp) {
                client.sendMessage(resp._serialized, message).then((response) => {
                    console.log("Send Message: ", response)
                    if (response.id.fromMe) {
                        res.status(200).json({status: 'success', message: `Message successfully sent to ${final_number}`, response, resp})
                    }
                }).catch(err => {
                    console.error(err)
                    res.status(400).json({status: 'err', "message": err.body, "err": err.message})
                });
            } else {
                console.log(final_number, "Mobile number is not registered"+ resp);
                res.send({status: 'Not Registered', "message": "Mobile number is not registered"})
            }
        }).catch(error=>{
            console.error(error)
            res.send({status: 'error', "message": error.body, "error": error.message})
        })
    }
});


module.exports = router;