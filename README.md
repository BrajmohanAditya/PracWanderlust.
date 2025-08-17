* make a folder in vs code and perform the following operation for basic setup 
> npm init -y (it will create package.json)
> npm i express (it will create node_module)
> npm ejs
> npm i mongoose
> Now create app.js folder 
  -------------       DATA   BASE    OPERATION ----------------

  /*  SQL notes (init folder meh jo data hai ushper ya operation hoga)
> nmongosh (switch to mongodb in cmd)
> show dbs (sara data base show karega)
> use whatsapp
> db.dropDatabase() , Sql query fro droping db
> wonderlust> db.listings.find(), db ka ander jo listingfile hai usko nikal k dega 
> wonderlust> db.reviews.find()
> wonderlust> db.listings.find({title: "opoppp"})
> app.get: request receive krta hai and kuch serve krta hai, like koi file. 
> wonderlust> show collections
*/

------------- .get()   .post()   .put()    .delet()   .use()   .listen()  .all()  ------------------

.get() :  is use to give response to  the request which comes from browser.

app.get("/", (req, res) => {
  res.send("Hi, I am root"); or to render something. 
});

.post(): is use to receive  request which comes from browser. like we submit a form. 

app.use() ek middleware ko attach karta hai, jo request-response ke beech me kaam karta hai (jaise logging, authentication, body parsing, routes handle karna, etc.).



EXPRESS ROUTER 

> Express routers are a way to organise your express application such that our primary app.js file does not become bloated.
  const router = express.Router()

  ----------   Project summmery -------------
step - 1>  Do Basic setup

step - 2>  establish database connection, init all data in collection name (Listing), 