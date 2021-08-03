const express = require("express");
const bodyParder = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const app=express();

app.set("view engine",ejs);
app.use(bodyParder.urlencoded({extended:true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/wikiDB",{useNewUrlParser:true});

const articleSchema ={
    title:String,
    content:String
}

const Article = mongoose.model("Article",articleSchema);

app.route("/articles")
.get(function(req,res){
    Article.find({},function(err,foundarticles){
        if(!err){
            res.send(foundarticles);
        }
    })

})
.post(function(req,res){
    const article = new Article({
        title:req.body.title,
        content:req.body.content
    })
    article.save(function(err){
        if(!err){
            res.send("succesfully added a article");
        }else{
            res.send(err);
        }
    })
  })
.delete(function(req,res){
    Article.deleteMany({},function(err){
        if(!err){
            res.send("succesfully deleted all articles");
        }else{
            res.send(err);
        
    }
    })
});

app.route("/articles/:articlename")
.get(function(req,res){
    Article.findOne({title:req.params.articlename},function(err,foundarticle){
        if(foundarticle){
            res.send(foundarticle);
        }else{
            res.send("error finding");
        }
    })
})
.put(function(req,res){
    Article.update({title:req.params.articlename},
        {title:req.body.title,content:req.body.content},
        {overwrite:true},
        function(err){
            if(!err){
                res.send("succesfully updated article");
            }
        })
})
.patch(function(req,res){
    Article.update({title:req.params.articlename},
        {$set:req.body},function(err){
            if(!err){
                res.send("succesfully updated article");
            }else{
                res.send(err);
            }
        })
})
.delete(function(req,res){
    Article.deleteOne({title:req.params.articlename},function(err){
        if(!err){
            res.send("successfully deleted");
        }else{
            res.send(err);
        }
    })
});


app.listen(3000,function(){
    console.log("server running");
})