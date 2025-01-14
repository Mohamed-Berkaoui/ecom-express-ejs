const express=require('express')
const products=require('./data')


const app=express()

app.use(express.static(__dirname+"/abc"))

app.use(express.urlencoded({extended:true}))

app.use(function(req,res,next){
    console.log("url : ",req.url," method : ",req.method)
    next()
})

app.get("/",(req,res)=>{
    res.render('index.ejs',{products})
})


app.get("/product/:id",(req,res)=>{
    // console.log(req.url.split('/')[2])
    console.log(req.params)
    const product=products.find(prod=>prod.id==req.params.id)
    res.render('product.ejs',{product})
})

app.get("/addproduct",(req,res)=>{
    res.render('addproduct.ejs',{products})
})
app.post("/addproduct",(req,res)=>{
    products.push({...req.body,id:Math.floor(Math.random()*1000)})
    res.redirect('/')
})
const port=7000

app.listen(port,function(){console.log("server running on port "+port)})