const express = require("express");
const app = express();
const bodyParser = require('body-parser')
const Core = require("./core");
new Core();

const User = require("./schema/user");

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


app.get("/users", async (req, res)=>{
    if(req.query.age){
        const userAge = await User.find({age: req.query.age});
        return res.status(200).json({
            data: userAge
        });
    }else{
        const user = await User.find();
        return res.status(200).json({
            data: user,
        });
    }
});

app.get("/user/", async(req, res)=>{
    const celular = req.query.cell;
    if(celular.length == 11){
        const user = await User.find({cell:celular});
        return res.status(200).json({
            data: user
        });
    }else{
        return res.status(400).json({
            error: "O numero de celular deve conter 11 digitos"
        });
    }
});

app.get("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user){
        return res.status(404).json({"error": "Usuario não encontrado"});
    }
    return res.status(200).json({
        data: user
    });
});

app.post("/users", async (req, res)=>{
    if((await User.findById(req.body.id))) {
        return res.status(404).json({error: "id ja existe na base de dados"});
    }
    const celular = req.body.cell;
    if(JSON.stringify(celular).length == 11){
        const user = {
            name: req.body.name,
            cpf: req.body.cpf,
            age: req.body.age,
            cell: celular
        };
        await (new User(user).save());
        return res.status(200).json({data: user});
    }else{
        return res.status(400).json({
            error: "Usuário não cadastrado: o número de celular deve conter 11 digitos"
        });
    }

});

app.patch("/users/:id", async(req, res)=>{
    const user = await User.findById(req.params.id);
    if(!user) {
        return res.status(404).json({
            error: "Usuario não encontrado"
        });
    }
    const celular = req.body.cell; 
    if(celular != undefined){
        console.log("entrou");
        if(JSON.stringify(celular).length != 11){
            return res.status(400).json({
                error: "O numero de celular deve conter 11 digitos"
            });
        }
    }
    await user.updateOne(req.body);
    return res.status(200).json({data: req.body});
});

app.delete("/users/:id", async (req, res)=>{
    return res.status(200).json({
        data: (await User.findOneAndRemove({_id: req.params.id}))
    });
});

app.listen(3000, ()=>{
    console.log("Server Started");
});
