const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');

//var router= express.Router();

const app = express();

//app.use('/sendmailalert',router);
app.use(bodyParser.urlencoded({extended : true}));
app.use(bodyParser.json());
app.post('/sendmailalert',sendMailAlert);



function sendMailAlert(req,res){

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);
const msg = {
  to: ['princeofficial88@gmail.com'],
  from: 'princesharma78@gmail.com',
  subject: 'New Order on Urban Fabrics',
  text: 'and easy to do anywhere, even with Node.js',
  html: '<strong>and easy to do anywhere, even with Node.js</strong>',
  templateId:'d-2bc9d09d2c8448bfa7dcc037cc1bc642',
  dynamic_template_data:{
    "amount":"₹"+req.body.totalamount,
    "items":req.body.items,
    "receipt":true,
    "name":req.body.firstname+" "+ req.body.lastname,
    "email":req.body.email,
    "phone":req.body.phone,
    "address":req.body.address
 }
};
sgMail.send(msg);
}


/**
 * const mailjet = require ('node-mailjet')
    .connect('fd25bdb6be4bbca6df43469dc04e7517', '301a3c6d5d3a2d1a29a68f37ae5e25b4')
    

    function sendMailAlert(req,res){
        console.log(req.body);
const request = mailjet
	.post("send", {'version': 'v3.1'})
	.request({
		"Messages":[
			{
				"From": {
					"Email": "ankeshkapil85@gmail.com",
					"Name": "Urban Fabrics"
				},
				"To": [
                    // {
                    //         "Email": "handafabrics@gmail.com",
                    //         "Name": "Vipul"
                    // },
                    {
                        "Email": "ankesh.kapil@gmail.com",
                        "Name": "Ankesh"
                }
            ],
				"TemplateID": 526864,
				"TemplateLanguage": true,
                "Subject": "New Order on Urban Fabrics",
				"TemplateErrorReporting": {
					"Email": "ankesh.kapil@gmail.com",
					"Name": "Air traffic control"
				},
				"Variables": {
      "cust_name": req.body.firstname+" "+ req.body.lastname,
      "email": req.body.email,
      "phone": req.body.phone,
      "address":req.body.address
    //   "order.items": JSON.stringify(req.body.items),
    //   "order.currency": "₹",
    //   "order.amount": req.body.totalamount
    }
			}
		]
	})
request
	.then((result) => {
        console.log(result.body)
        res.status(200).json(result.body);
	})
	.catch((err) => {
        console.log(err.statusCode)
        res.status(err.statusCode);
    })

   
}
 */


// Serve only the static files form the dist directory
app.use(express.static(__dirname + '/dist/angularShop'));

app.get('/*', function(req,res) {
    
res.sendFile(path.join(__dirname+'/dist/angularShop/index.html'));
});

// Start the app by listening on the default Heroku port
app.listen(process.env.PORT || 8080);