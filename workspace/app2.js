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

mongoose.set('useFindAndModify', false);

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

var artUserNumSchema=mongoose.Schema({
	artnum:Number,
	usernum:Number
});

var artUser=mongoose.model("artnum",artUserNumSchema);

/*
artUser.create({artnum:-1,usernum:-1},function(err,el){
	if(err)
		console.log(err);
	else
		console.log(el);
})
*/




var matSchema=mongoose.Schema({
	table:Array
});

var matData=mongoose.model("matrixdata",matSchema);

/*
matData.create({table:[]},function(err,el){
	if(err)
		console.log(err)
	else
		console.log(el);
})
*/


var newSchema1= mongoose.Schema({
	num:Number,
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


var news=mongoose.model("news2",newSchema1);


var userSchema2= new mongoose.Schema({
  username:String,
  num:Number,
  password:String,
  email:String,
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
var User=mongoose.model("User2",userSchema2);

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


app.post("/home",isLoggedIn,function(req,res)
{
	User.findById(req.user._id,function(err,el1){
		if(err)
		{
			console.log(err);
			res.redirect("/home1");
		}
		else
		{	artUser.find({},function(err2,ele){
					var a=req.body.title;
					var b=req.body.image;
					var c=req.body.content;
					var d=req.body.category;
					var e=req.user.username;
					var f=req.user.email;
					var g=ele[0].artnum+1;
					var el={
						title:a,
						image:b,
						content:c,
						category:d,
						author:e,
						num:g,
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
						ele[0].artnum=ele[0].artnum+1;
						ele[0].save();
						matData.find({},function(errM,eleM){
							if(errM)
								console.log(errM);
							else
							{
								var table=eleM[0].table;
								var matrix=math.matrix(table);
								if(matrix.size()[0]==0)
								{
									if(ele[0].usernum>-1)
									{
										matrix.resize([ele[0].usernum+1,1],0);
										eleM[0].table=matrix.valueOf();
										//console.log(eleM[0]);
										eleM[0].save();
										matData.findByIdAndUpdate(eleM[0]._id,{table:matrix.valueOf()},function(errs,eles){
											if(errs)
												console.log(errs);
											else
												console.log(eles);
										})
									}
								}
								else{
										matrix.resize([matrix.size()[0],matrix.size()[1]+1],0);
										eleM[0].table=matrix.valueOf();
										//console.log(eleM[0]);
										eleM[0].markModified("table");
										eleM[0].save();
										matData.findByIdAndUpdate(eleM[0]._id,{table:matrix.valueOf()},function(errs,eles){
											if(errs)
												console.log(errs);
											else
												console.log(eles);
										})
										
								}
							}
						});//matData ending
						
					})//news create ending
			})//artuser ending
		}
	})//findByID ending
	
});//register ending
	




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


app.get("/home/new/elements",function(req,res){
	console.log("In the get elements....");
	news.find().distinct('_id', function(error, ids) {
    // ids is an array of all ObjectIds
		console.log(ids);
		res.send(ids);
	});
});



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
	res.send(req.user);
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
					console.log(err);
					res.redirect("/home");
					
				}
				res.redirect("/home/"+req.params.id);
				
			});
	
});


app.get("/recommendations",isLoggedIn,function(req,res){
	res.render("recommendation");
})


app.get("/recommendations/elements",isLoggedIn,function(req,res){
	matData.find({},function(err,el){
		var matrix=el[0].table;
		var Model=Recommender.buildModel(matrix);
		var data=Model.recommendations(req.user.num);
		console.log("The recommendations data is:")
		console.log(data);
		var data2=new Array();
		var j=0;
		for(var i=0;i<data.length;i=i+1)
		{
			if(data[i][1]>2.5)
			{
				data2[j++]=data[i][0];
			}
		}
		res.send(data2);
	});
});


app.get("/recommendations/element/:num",function(req,res){
	news.findOne({num:req.params.num},function(err,el){
		if(err)
			console.log(err);
		else
			res.send(el);
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




app.post("/ratings/:unum/:anum",isLoggedIn,function(req,res){
	matData.find({},function(err,ele){
		if(err)
			console.log(err);
		else
		{
			
			var table=ele[0].table;
			table[req.params.unum][req.params.anum]=Number(req.body.val);
			console.log("Request val is :",req.body.val);
			ele[0].table=table;
			ele[0].markModified("table");
			ele[0].save();
			console.log(ele[0]);
			matData.findByIdAndUpdate(ele[0]._id,{table:table},function(errs,eles){
				if(errs)
					console.log(errs);
				else
					console.log(eles);
				});
		}
		
		res.send("Rated Successfully");
	
		})
});


    
app.get("/register",function(req,res)
{
  res.render("register1");
});

app.post("/register",function(req,res){
	artUser.find({},function(err,el){
	  var a=req.body.username;
	  var b=req.body.email;
	  var c=el[0].usernum+1;
	  var newUser=new User({username:a,email:b,num:c});
	  User.register(newUser,req.body.password,function(err,user){
		if(err){
		  console.log(err);
		  return res.render("register1");
		}
		passport.authenticate("local")(req,res,function(){
		  var num=el[0].usernum;
		  el[0].usernum=num+1;
		  el[0].save();
		  res.redirect("/home1");
		  matData.find({},function(errM,eleM){
							if(errM)
								console.log(errM);
							else
							{
								var table=eleM[0].table;
								var matrix=math.matrix(table);
								if(matrix.size()[0]==0)
								{
									if(eleM[0].artnum>-1)
									{
										matrix.resize([1,eleM[0].artnum+1],0);
										eleM[0].table=matrix.valueOf();
										//console.log(eleM[0]);
										eleM[0].save();
										matData.findByIdAndUpdate(eleM[0]._id,{table:matrix.valueOf()},function(errs,eles){
											if(errs)
												console.log(errs);
											else
												console.log(eles);
										})
									}
								}
								else{
										matrix.resize([matrix.size()[0]+1,matrix.size()[1]],0);
										eleM[0].table=matrix.valueOf();
										//console.log(eleM[0]);
										eleM[0].markModified("table");
										eleM[0].save();
										matData.findByIdAndUpdate(eleM[0]._id,{table:matrix.valueOf()},function(errs,eles){
											if(errs)
												console.log(errs);
											else
												console.log(eles);
										})
										
								}
							}
						});//matData ending
		  	
		});

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
  successRedirect:"/home1",
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