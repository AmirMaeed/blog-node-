require("dotenv").config();

const express = require("express");
const app = express();

const path = require("path");
const cookieParser = require("cookie-parser");
const verifyToken = require("./middleware/jwtMiddleware");
//import routes
const userRoutes = require('./routes/userRoutes');
const teamRoutes = require('./routes/teamRoutes');
const postRoutes = require("./routes/postRoutes");
const contactRoutes =  require("./routes/contact.js");


// Connect to MongoDB
const db =require("./config/db");
db();





// Ensures views are correctly located


// use Middleware
app.set('view engine', 'ejs');
app.set("views", path.join(__dirname, "views")); 

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public"))); // Serve static files



// Routes
app.use('/', userRoutes);
app.use('/', teamRoutes);
app.use('/', postRoutes);

// Public Pages
app.get("/", (req, res) => res.render("index",{ user: req.user }));
app.get("/login", (req, res) => res.render("login"));
app.get("/register", (req, res) => res.render("register"));



// Home Page: Fetch All Posts
const Post = require("./models/postModel");
const User = require("./models/userModel");


app.get("/", async (req, res) => {
  
    res.render("index", { user: req.user });
});




app.get('/about',(req,res)=>{
  res.render('about')
})




app.get('/team',(req,res)=>{
  res.render('team')
})



app.get('/login',(req,res)=>{
  res.render('login')
})

app.use("/", contactRoutes);

app.get("/users",async (req, res) => {
 
  const users = await User.find();

  res.render("user" ,{users});

});









app.get("/search", async (req, res) => {
  try {
    const searchQuery = req.query.search || ""; // Get search input from URL

    let filter = {}; // Default: show all posts
    if (searchQuery) {
      filter = {
        $or: [
          { title: { $regex: searchQuery, $options: "i" } }, // Search in title
          { content: { $regex: searchQuery, $options: "i" } }, // Search in content
        ],
      };
    }

    const posts = await Post.find(filter).sort({ createdAt: -1 });

    res.render("search", { posts, searchQuery }); // Send results to EJS
  } catch (error) {
    console.error("Error fetching posts:", error);
    res.status(500).send("Error fetching blog posts.");
  }
});




// if user go to other page which not make
app.use((req, res) => {
  res.status(404).render("404");
});


// Start servers

app.listen(3000, () => {
  console.log(`Server running at http://localhost:3000`);
});
