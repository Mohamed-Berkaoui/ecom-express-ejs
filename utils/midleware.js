function middelware(){
    return (req,res,next)=>{
        console.log("url : ",req.url," method : ",req.method)
        next()
    }
    
}

module.exports=middelware