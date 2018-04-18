
const request = require('request');
var fs = require('fs');
const nodemailer = require('nodemailer');
var fileHandler = require('./firebase-file-upload')

module.exports.file = function(req,res) {
    var fileB_Data = [];
    var fileA_keys = [];
    var fileB_keys = [];
    var fileA_Data = [];
    var fileA_Content = [];

  request('http://upsailgroup.herokuapp.com/Service/firebase/FileA.txt', function (error, response, fileA_Res) {
    // res.send(fileAData);
    console.log("__dirname",__dirname)
    fs.readFile(__dirname + '/../files/FileB.csv', 'utf8', function(err, data) {
      if(err) {
        console.log("err",err,data)
        return err;
      }
      fileB_Content = data.split("\n");
      fileB_keys = fileB_Content.splice(0, 1)[0].split(",");
      fileB_Content.forEach(item => {
        var array = item.split(",");
        var result = {};
        fileB_keys.forEach((itemkey, index) => {
          result[itemkey] = array[index];
        })
        fileA_Data.push(result);
      });

      // fs.readFile(fileA_Res, 'utf8', function(err, data) {
        // var writeStream = fs.createWriteStream("fileResult.csv");
        fileA_Data = fileA_Res.split("\n");
        // console.log("fileB_Data",fileB_Data)
        fileA_keys = fileA_Data[0].split("\t");
        skuIndex = fileA_keys.indexOf('SupplierSKU');
        eanIndex = fileA_keys.indexOf('Barcode');
        var newFileArr = [];
        for (var i = 0; i < fileB_Data.length; i++) {
          for (var j = 0; j < fileA_Data.length; j++) {
            itemBArr = fileB_Data[j].split("\t");
            if (fileB_Data[i]["SKU*"] == itemBArr[skuIndex] || fileB_Data[i]["UPC/EAN"] == itemBArr[eanIndex]) {
              fileA_Data.splice(j, 1);
              j--;
            }
          }
        }

        console.log("fileA_Data",fileA_Data.length)

        fs.writeFile(__dirname + "/../uploads/FileC.tsv", fileA_Data.join(('\n')), (err) => {
          if (err) return res.send("Not Uploaded");
          fileHandler.uploadFile("FileC.tsv");
          res.send("Successfully Uploaded");

          nodemailer.createTestAccount((err, account) => {
            // create reusable transporter object using the default SMTP transport
            var transporter = nodemailer.createTransport({
              service: 'gmail',
              auth: {
                user: 'mailerabhi111@gmail.com',
                pass: 'Abhi@12345'
              }
            });

            // setup email data with unicode symbols
            let mailOptions = {
              from: 'mailerabhi111@gmail.com', // sender address
              to: 'shashanksmf@outlook.com', // list of receivers
              subject: 'Upload Status', // Subject line
              text: '', // plain text body
              html: 'Hi,'
              +'<br />'
              +'<br />'
              +'FileC has been created with '+fileA_Data.length+' records.'
              +'<br />'
              +'<br />'
              +'Thank you' // html body
            };

            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                return console.log("error--11--", error);
                res.json({ isError: true, data: error });
              } else {
                console.log('Message sent: %s', info.messageId);
                console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                res.json({ isError: false, data: 'Please check your Email' });
              }
              // Preview only available when sending through an Ethereal account
              // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>
              // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
            });
            //    res.json(mailOptions);
          });

          return;
        })

      // });
    })
    })
  }
