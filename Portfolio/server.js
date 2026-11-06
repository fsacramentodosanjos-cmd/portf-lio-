const express = require('express');
const cors = require('cors');
const nodemailer = require('nodemailer');
const { engine } = require('express-handlebars');
const path = require('path')


require('dotenv').config();



const app = express();

 app.engine('handlebars', engine({
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),
    partialsDir: path.join(__dirname, 'views/partials')
}));

app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(cors());
app.use(express.json());

app.get('/', (req,res)=>{
    res.render('menu');
});

app.post('/enviar', async (req, res) => {

    const { nome, email, mensagem } = req.body;

    
    if (!nome || !email || !mensagem) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Preencha todos os campos.'
        });
    }

    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            sucesso: false,
            mensagem: 'Email inválido.'
        });
    }

    try {

       const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    },
    tls: {
        rejectUnauthorized: false
    }
});

        await transporter.sendMail({
            from: `"Portfólio - ${nome}" <${process.env.EMAIL_USER}>`,
            replyTo: email,
            to: process.env.EMAIL_USER,
            subject: `Contato do Portfólio - ${nome}`,
            text: `
Nome: ${nome}

Email: ${email}

Mensagem:
${mensagem}
            `
        });

        res.status(200).json({
            sucesso: true,
            mensagem: 'Email enviado com sucesso!'
        });

    } catch (erro) {

        console.error(erro);

        res.status(500).json({
            sucesso: false,
            mensagem: 'Erro ao enviar email. Tente novamente mais tarde.'
        });

    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
