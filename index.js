

var imaps = require('imap-simple');
const simpleParser = require('mailparser').simpleParser;
const _ = require('lodash');
const express = require('express');
const app = express();

app.set('view engine','ejs')
app.get('/',(req,res,next) => {
    var config = {
        imap: {
            user: 'deneme1@xfxpositions.ml',
            password: 'deneme1',
            host: 'mail.xfxpositions.ml',
            port: 993,
            tls: true,
            authTimeout: 3000
        }
    };
    imaps.connect(config).then(function (connection) {
        
        return connection.openBox('INBOX',(err,box)=>{
            console.log(box.messages)
            res.locals.box_messages = box.messages;
            var searchCriteria = ['4'];
            var fetchOptions = {
                bodies: ['HEADER', 'TEXT', ''],
            };
            var x = ""
            var y = ""
            return connection.search(searchCriteria, fetchOptions).then(function (messages) {
                messages.forEach(function (item) {
                    var all = _.find(item.parts, { "which": "" })
                    var id = item.attributes.uid;
                    var idHeader = "Imap-Id: "+id+"\r\n";
                    simpleParser(idHeader+all.body, (err, mail) => {
                        // access to the whole mail object
                        console.log(mail.subject)
                        res.locals.mail_subject = mail.subject
                        x = mail.subject
                        console.log(mail.html)
                        res.locals.mail_html = mail.html
                        y = mail.html
                        console.log(res.locals)
                        
                            console.log("x = "+x)
                        connection.end()
                        next()
                    
                    })
                });
               
            })
        })
           
    })
    
},(req,res) => {
    res.render('index')
})


app.listen('80',() => {
    console.log('listening on 80')
})