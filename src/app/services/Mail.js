const path = require('path')
const hbs = require('nodemailer-express-handlebars')
const exphbs = require('express-handlebars')
const mailer = require('nodemailer')
const mailConfig = require('../../config/mail')

const transport = mailer.createTransport(mailConfig)

transport.use(
  'compile',
  hbs({
    viewEngine: exphbs(),
    viewPath: path.resolve(__dirname, '..', 'views', 'emails'),
    extName: '.hbs'
  })
)

module.exports = transport
