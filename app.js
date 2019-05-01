var express= require("express");
var app= express();

var ejb= require("ejs");
app.set("view engine","ejs");

var bodyParser=require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

//accessing the public folder 
app.use(express.static("public"));

var methodOverride= require("method-override");
app.use(methodOverride("_method"));

//setting mongo db
var mongoose=require("mongoose");
mongoose.connect("mongodb://localhost/blog_app");

var blogSchema=new mongoose.Schema({
   name : String,
   image: String,
   body : String,
   date : {type: Date, default: Date.now}
});

var blog=mongoose.model("blog",blogSchema);

//INDEX:Show all Blogs
app.get("/blogs",function(req,res){
        blog.find({},function(err,allblog){
            if(err){
                res.render("index");
            }else{
                res.render("index", {blogs:allblog});
            }
        });
});

//Create: Creating new Blog
app.post("/blogs",function(req, res){
    blog.create(req.body.blog,function(err,newblog){
        if(err){
            console.log("Somethings Wrong");
            console.log(err);
        }else{
            res.redirect("/blogs");
        }
    });
});

//NEW: form to create blog
app.get("/blogs/new", function(req,res){
    res.render("new");
});

//SHOW: view particular Blog
app.get("/blogs/:id",function(req,res){
    blog.findById(req.params.id, function(err,foundblog){
        if(err){
            res.render("index")
        }else{
        res.render("show",{blog:foundblog});
        }    
    });
});

//EDIT: edit the post
app.get("/blogs/:id/edit", function(req, res){
    // res.send("this edit form");
    //call the create form with details filled
    blog.findById(req.params.id, function(err,foundblog){
        if(err){
            res.render("index")
        }else{
        res.render("update",{blog:foundblog});
        }    
    });
});

//Update: update into database
app.put("/blogs/:id", function(req, res){
    blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, Updatedblog){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs/" +req.params.id);
        }
    });
});

//DELETE: delete particular blog
app.delete("/blogs/:id", function(req, res){
    blog.findByIdAndRemove(req.params.id,function(err){
        if(err){
            res.redirect("/blogs");
        } else{
            res.redirect("/blogs");
        }
    });
});



app.listen(process.env.PORT,process.env.IP,function(){
    console.log("YELPCAMP SERVER HAS STARTED..!");
});