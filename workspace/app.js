var express=require("express")
var app=express();
var bodyParser=require("body-parser");
var mongoose=require("mongoose");
var passport=require("passport");
var LocalStrategy=require("passport-local");
var passportLocalMongoose=require("passport-local-mongoose");
var methodOverride=require("method-override");
var mysql=require("mysql");
var math=require("mathjs");
var Recommender=require("likely")
app.set("view engine","ejs");



var con = mysql.createConnection({
	host:"localhost",
	user:"root",
	database:"news"
});



mongoose.connect("mongodb://localhost/news",{ useNewUrlParser: true,useUnifiedTopology: true});
app.use(methodOverride("_method"));
//Authentication Cofiguration
app.use(require("express-session")({

    secret: "Hello world",

    resave: false,

    saveUninitialized: false

}));

app.use(passport.initialize());
app.use(passport.session());



app.use(bodyParser.urlencoded({extended:true}));

con.connect(function(err) {
	  if (err) throw err;
});

//Schema Decalrations
var commentData11=new mongoose.Schema({
    name:String,
    comment:String,
	date:String,
	id_parent:String,
	
});

var comData11=mongoose.model("comData11",commentData11);

var commentData1=new mongoose.Schema({
    name:String,
    comment:String,
	date:String,
	id_parent:String,
	replies:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"comData11"
	} ],
});

var commentData1=new mongoose.Schema({
    name:String,
    comment:String,
	date:String,
	id_parent:String,
	replies:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"comData11"
	} ],
});

var comData=mongoose.model("comData",commentData1);



var newSchema1= mongoose.Schema({
	title:String,
	image:String,
	content:String,
	author:String,
	date:String,
	author_email:String,
	category:String,
	comments:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"comData"
	}],
	
});

app.use(function(req,res,next){
  res.locals.currentUser=req.user;
  next();
})


var news=mongoose.model("news",newSchema1);


var userSchema2= new mongoose.Schema({
  username:String,
  password:String,
  comments:[{
    type:mongoose.Schema.Types.ObjectId,
    ref:"comData",
  }],
	posts:[{
		type:mongoose.Schema.Types.ObjectId,
		ref:"news"
	}]
});

userSchema2.plugin(passportLocalMongoose);
var User=mongoose.model("User",userSchema2);

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

/*


news.create(
	{
		title:"Millennial Depression Is on the Rise",
		image:"https://in.images.search.yahoo.com/images/view;_ylt=AwrwJRjr2Jhd8UgA0Lm9HAx.;_ylu=X3oDMTIzM3Y3MXEzBHNlYwNzcgRzbGsDaW1nBG9pZAM1NWY0NmZmZGMxMmMzOWM5NzYzZDFlMDdjNzRkMzI1MwRncG9zAzg3BGl0A2Jpbmc-?back=https%3A%2F%2Fin.images.search.yahoo.com%2Fsearch%2Fimages%3Fp%3Dmillennials%2Bdepression%26fr%3Dmcafee%26fr2%3Dpiv-web%26nost%3D1%26tab%3Dorganic%26ri%3D87&w=1100&h=617&imgurl=media.npr.org%2Fassets%2Fimg%2F2015%2F10%2F09%2Fmillennials_3_custom-e5ec434a979246c1f0d36d287125fa8a7d91fabe-s1100.jpeg&rurl=https%3A%2F%2Fwww.npr.org%2Fsections%2Fhealth-shots%2F2015%2F10%2F12%2F446928518%2Fis-the-resilience-of-millennials-underrated&size=599.0KB&name=Is+The+Resilience+Of+Millennials+Underrated%3F+%3A+Shots+-+Health+News+%3A+NPR&p=millennials+depression&oid=55f46ffdc12c39c9763d1e07c74d3253&fr2=piv-web&fr=mcafee&tt=Is+The+Resilience+Of+Millennials+Underrated%3F+%3A+Shots+-+Health+News+%3A+NPR&b=61&ni=21&no=87&ts=&tab=organic&sigr=13actt8fq&sigb=13omens79&sigi=13c9uec9n&sigt=128ernk42&sign=128ernk42&.crumb=/GNU.YKOIEG&fr=mcafee&fr2=piv-web",
		content:"Depression may be on the rise among younger millennials even as typical risk factors such as substance use and antisocial behavior fall, a new study in the International Journal of Epidemiology suggests.Researchers looked at two groups of millennials in the United Kingdom, one born between 1991 and 1992 and a second born between 2000 and 2002.The researchers said they found that overall symptoms of both depression and self-harm had increased by age 14 in the younger cohort compared to the older one.Symptoms of depression increased from 9 percent to almost 15 percent between 2005 and 2015 — the years of each group’s respective check-in — while reported self-harm increased from almost 12 percent to more than 14 percent. What’s more, the younger millennials reported lower overall risk factors such as smoking (3 percent compared to 9 percent) and drinking alcohol (43 percent versus 52 percent), as well as fewer anti-social behaviors (28 percent versus 40 percent). While this newest research came from the United Kingdom, similar findings have been made in the United States.",
	author:"Sushanth Jain",
	author_email:"sushanthjain7@gmail.com",
	category:"health and well-being"
	
	},function(err)
	{
		if(err)
			{
				console.log(err);
			}
	});
*/

app.get("/test",function(req,res)
{
	res.render("test",{"a":1});
});

app.get("/testdata",function(req,res){
	res.send({hello:1});
});


app.get("/newsfeed",function(req,res){
	res.render("newsfeeds");
});


app.get("/",function(req,res){
	res.render("landing");		
});

app.get("/pricing",function(req,res){
	
  	  con.query("SELECT * FROM pricing", function (err, result, fields) {
      if (err) throw err;
      console.log(result);
	  res.render("pricing",{result:result});
  		});
}); 



app.get("/home",function(req,res){
	news.find({},function(err,contents){
			  if(err)
					console.log(err);
			  else
				  {
					 res.render("home",{contents:contents}); 
				  }
			  });
	
});


app.get("/home/new_page/elements",function(req,res){
	news.find().distinct('_id', function(error, ids) {
    // ids is an array of all ObjectIds
		console.log(ids);
		res.send(ids);
	});
});

app.get("/rsa",function(req,res){
	res.render("rsa");
})


app.get("/home/newele/:id",function(req,res)
{
	news.findById(req.params.id,function(err,el){
		if(err)
			console.log(err);
		else
			{
				res.send(el);
			}
	});	
});



app.get("/news/:id",function(req,res)
{
	news.findById(req.params.id,function(err,el){
		if(err)
		{
			console.log(err);		
		}
		else
		{
			res.send(el);		
		}
	});
});

app.get("/lpg",function(req,res){
	res.render("lpg");
})

app.get("/mainc",function(req,res){
	res.render("mainc");
})


app.get("/comments/:id",function(req,res){
	comData.findById(req.params.id,function(err,el){
		if(err)
		{
			console.log(err);
		}	
		else
		{
			res.send(el);
		}	
	});
});


app.get("/user",function(req,res){
	if(req.user)
		res.send(req.user);
	else 
		res.send({username:null});
});

app.post("/home",isLoggedIn,function(req,res)
{
	User.findById(req.user._id,function(err,el1){
		if(err)
		{
			console.log(err);
			res.redirect("/home1");
		}
		else
		{
			var a=req.body.title;
			var b=req.body.image;
			var c=req.body.content;
			var d=req.body.category;
			var e=req.user.username;
			var f=req.user.email;
			var el={
				title:a,
				image:b,
				content:c,
				category:d,
				author:e,
				author_email:f,
				date:Date()
			};
			news.create(el,function(err2,el3)
			{
				if(err2)
				{
					console.log(err3);
					res.redirect("/home1");
				}
				el1.posts.push(el3);
				el1.save();
				res.redirect("/home1");
			})
		}
	})
	
});
	
app.get("/home1",function(req,res){
	res.render("home_new.ejs");
});





app.get("/home/new",isLoggedIn,function(req,res){
	res.render("newspost");	
});


app.get("/home/:id",function(req,res){
  news.findById(req.params.id).populate("comments").exec(function(err,el){
  
    if(err)
      console.log(err);
    else{
      console.log(el);
      res.render("show",{el:el});
  }});
});


app.get("/home/:id/commentsArray",function(req,res){
  news.findById(req.params.id,function(err,el){
  
    if(err)
      console.log(err);
    else{
      console.log(el);
      res.send(el.comments);
  }});
});


/*
app.get("/home")

app.get("/home1/:id/ele",function(req,res){
	news.findById(req.params.id,function(err,el){
		if(err)
		{
				console.log(err);
		}
		else
		{
			res.send(el);		
		}
	});
});
*/

app.get("/home/:id/comments/new",isLoggedIn,function(req,res)
{	news.findById(req.params.id,function(err,el){
	if(err)
		console.log(err);
	else
		res.render("comment",{el:el});
});
});

app.post("/:id/comments",isLoggedIn,function(req,res){
  news.findById(req.params.id,function(err,el){
      if(err)
        console.log(err)
      else
        {   var com={
          name:req.user.username,
          comment:req.body.usercomment,
		  id_parent:req.params.id,
		  date:Date()
              }
        comData.create(com,function(err,el1){
          if(err)
            console.log(err)
          else
            {
              el.comments.push(el1);
              el.save();
              req.user.comments.push(el1);
              req.user.save();
              res.redirect("/home/"+req.params.id);
            }
        })
          
        }

});
});

app.get("/home/:id/edit",checkOwnership,function(req,res)
{

		news.findById(req.params.id,function(err,el){
			res.render("edit",{el:el});
		});
});

app.put("/home/:id",checkOwnership,function(req,res){
		
		var a=req.body.title;
			var b=req.body.image;
			var c=req.body.content;
			var d=req.body.category;
			var e=req.user.username;
			var f=req.user.email;
			var el={
				title:a,
				image:b,
				content:c,
				category:d,
				author:e,
				author_email:f,
				date:Date()
			};
			news.findByIdAndUpdate(req.params.id,el,function(err,el1)
			{
				if(err)
				{
					cosnole.log(err);
					res.redirect("/home");
					
				}
				res.redirect("/home/"+req.params.id);
				
			});
	
});

app.get("/home/:id2/comments/:id/edit",comOwnership,function(req,res)
{
	comData.findById(req.params.id,function(err,el)
	{
		if(err)
		{
			console.log(err);
			res.redirect("back");
		}
		res.render("editcom",{el:el});
		
	});
});

app.put("/home/:id2/comments/:id",comOwnership,function(req,res){
		
		var a=req.user.username,
			b=req.body.comment,
			c=Date(),
			d=req.params.id2;
		var el={
			name:a,
			comment:b,
			date:c,
			id_parent:d
		};
		comData.findByIdAndUpdate(req.params.id,el,function(err,el1)
			{
				if(err)
				{
					cosnole.log(err);
					res.redirect("/home");
					
				}
				res.redirect("/home/"+req.params.id2);
				
			});
	
});



app.get("/home/:id2/comments/:id/replies",function(req,res)
{
	comData.findById(req.params.id).populate("replies").exec(function(err,el){
  
    if(err)
      console.log(err);
    else{
      console.log(el);
      res.render("showreplies",{el:el});
  }});
});



app.get("/home/:id2/comments/:id/replies/new",isLoggedIn,function(req,res)
{	comData.findById(req.params.id,function(err,el){
	
	if(err)
		console.log(err);
	else
		res.render("reply",{el:el});
});
});

app.post("/home/:id2/comments/:id/replies/new",isLoggedIn,function(req,res)
{
	comData.findById(req.params.id,function(err,el){
      	if(err)
       		 console.log(err)
     	 else
        {    var com={
         	 name:req.user.username,
         	 comment:req.body.usercomment,
		 	 id_parent:req.params.id,
		 	 date:Date()
				}
		
			comData11.create(com,function(err,el1){
          	if(err)
            	console.log(err)
          	else
            	{
              	el.replies.push(el1);
              	el.save();
              	req.user.comments.push(el1);
              	req.user.save();
              	res.redirect("/home/"+req.params.id2+"/comments/"+req.params.id+"/replies");
            	}
        	});
							 
		}
	});
});


    
app.get("/register",function(req,res)
{
  res.render("register1");
});

app.post("/register",function(req,res){
  var a=req.body.username;
  var b=req.body.email;
  var newUser=new User({username:a,email:b});
  User.register(newUser,req.body.password,function(err,user){
    if(err){
      console.log(err);
      return res.render("register1");
    }
    passport.authenticate("local")(req,res,function(){
      res.redirect("/home");
    });
    
  });
});

/*
app.delete("/home/:id2/comments/:id",comOwnership,function(req,res){
	comData.findByIdAndRemove(req.params.id,function(err)
	  {
		if(err)
		{
			console.log(err);
			res.redirect("/home"+req.params.id);
			}
		res.redirect("/home/"+req.params.id2);
	});
});
*/

app.delete("/home/:id2/comments/:id",comOwnership,function(req,res){
	comData.findByIdAndRemove(req.params.id,function(err)
	  {
		if(err)
		{
			console.log(err);
			res.redirect("/home"+req.params.id);
		}
		news.findById(req.params.id2,function(err,el){
			if(err)
			{
				console.log(err);
			}
			else
			{
				var pos=el.comments.indexOf(req.params.id);
				if(pos!=-1)
				{
					el.comments.splice(pos,1);
					el.save();
				}
			}
		});
		res.redirect("/home/"+req.params.id2);
	});
});

app.get("/signin",function(req,res)
{
	res.render("signin");
	
	
});

app.post("/signin",passport.authenticate("local",{
  successRedirect:"/home",
  failureRedirect:"/signin",
}),function(req,res){
	
});

app.get("/signout",function(req,res){
  res.locals.currentUser=null;
  req.logout();
  res.redirect("/home");
});


app.delete("/home/:id",checkOwnership,function(req,res){
	news.findByIdAndRemove(req.params.id,function(err)
	  {
		if(err)
		{
			console.log(err);
			res.redirect("/home"+req.params.id);
			}
		res.redirect("/home");
	});
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/signin");
}


function checkOwnership(req,res,next)
{
	if(req.isAuthenticated())
	{
		news.findById(req.params.id,function(err,el){
			if(err)
				res.redirect("back");
			else{
				if(el.author==req.user.username)
					{
						next();
					}
				else
					{
						res.redirect("back");
					}
			}
		});
	}
	else
		res.redirect("/signin");
}


function comOwnership(req,res,next)
{
	if(req.isAuthenticated())
	{
		comData.findById(req.params.id,function(err,el){
			if(err)
				res.redirect("back");
			else{
				if(el.name==req.user.username)
					{
						next();
					}
				else
					{
						res.redirect("back");
					}
			}
		});
	}
	else
		res.redirect("/signin");
}



app.listen(4000,function(err)
		  {		if(err)
			  		console.log(err);
		   		else
				console.log("The website server has started");
});