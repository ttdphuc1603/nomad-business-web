const express = require('express');
const app = express();
const port = 4003;
const morgan=require("morgan")
app.use(morgan("combined"))
const bodyParser=require("body-parser")
const cors=require("cors");
const mongoose = require('mongoose');
app.use(cors());


app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ extended: true, limit: '100mb' }));
app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb' }));
app.use(express.json());




// Error handling middleware
app.use((obj, req, res, next) => {
  const statusCode = obj.status || 500;
  const errorMessage = obj.message || "Something went wrong";
  return res.status(statusCode).json({
      success: [200, 201, 204].some(a => a === obj.status) ? true : false,
      status: statusCode,
      message: errorMessage,
      data: obj.data
  })
})


app.listen(port,()=>{
console.log(`My Server listening on port ${port}`)
})



app.get("/",(req,res)=>{
res.send("This Web server is processed for MongoDB")
})
const { MongoClient, ObjectId } = require('mongodb');
client = new MongoClient("mongodb://127.0.0.1:27017");
client.connect();
database = client.db("NomadData");
productCollection = database.collection("Products")
discountCodeCollection = database.collection("DiscountCode")
orderCollection = database.collection("Orders")
geoDataCollection = database.collection("GeoData")
PostCollection = database.collection("Blog")
adminCollection = database.collection("users");


app.get("/products",cors(),async (req,res)=>{
const result = await productCollection.find({}).toArray();
res.send(result)
})

app.get('/search-results', async (req, res) => {
  let key = req.query.key;
  const result = await productCollection.find({ productname: { $regex: new RegExp(key, 'i') } }).toArray();
  res.send(result);
});


// Maintain Discount Code
app.get("/discountCode", cors(), async (req, res) => {
  const result = await discountCodeCollection.find({}).toArray();
  res.send(result)
})

app.get("/products/:id",cors(),async (req,res)=>{
    var o_id = new ObjectId(req.params["id"]);
    const result = await productCollection.find({_id:o_id}).toArray();
    res.send(result[0])
    })


app.get("/discountCode/:id", cors(), async (req, res) => {
    _id = req.params["id"];
    let c = discountCodeCollection.find(x => x._id == _id)
    res.send(c)
})


app.post("/products",cors(),async(req,res)=>{
await productCollection.insertOne(req.body)
res.send(req.body)
})

app.post("/discountCode", cors(), async (req, res) => {
  await discountCodeCollection.insertOne(req.body)
  res.send(req.body)
})


app.put("/products/:id", cors(), async (req, res) => {
    const nomadId = req.params.id;

    await productCollection.updateOne(
      { _id: new ObjectId(productId) }, // Tìm nomad dựa trên ID
      {
        $set: {
        _id: req.body._id,
        productid: req.body.productid,
        productname: req.body.productname,
        currentprice: req.body.currentprice,
        originalprice: req.body.originalprice,
        category: req.body.category,
        color: req.body.color,
        size: req.body.size,
        image: req.body.image,
        thumbnail: req.body.thumbnail,
        tag: req.body.tag,
        introduction: req.body.introduction,
        fordetail: req.body.fordetail,
        instruction: req.body.instruction,
        description: req.body.description
        }
      });
    const result = await productCollection.findOne({ _id: new ObjectId(nomadId) });
    res.send(result[0])
  });

//Edit a Product
app.put("/products",cors(),async(req,res)=>{
  //update json Product into database
  await productCollection.updateOne(
    {_id:new ObjectId(req.body._id)},//condition for update
    { $set: 
      { //Field for updating
        productid: req.body.productid,
        productname:req.body.productname,
        category:req.body.category,
        description:req.body.description,
        image:req.body.image,
        name:req.body.color.name,
        hex:req.body.color.hex,
        size:req.body.size,
        general:req.body.introduction.general,
        note:req.body.introduction.note,
        tag:req.body.tag,
        currentprice:req.body.currentprice

      }
    } 
  )
  //send Product after updating
  var o_id = new ObjectId(req.body._id);
  const result = await productCollection.find({_id:o_id}).toArray();
  res.send(result[0])
})

  app.put("/discountCode", cors(), async (req, res) => {
    await discountCodeCollection.updateOne(
        { _id: new ObjectId(req.body._id) },
        {
            $set: {
                codeId: req.body.codeId,
                applyOn: req.body.applyOn,
                quantity: req.body.quantity,
                discountType: req.body.discountType,
                codeDom: req.body.codeDom,
                validFrom: req.body.validFrom,
                validTo: req.body.validTo

            }
        })
    var o_id = new ObjectId(req.body._id);
    const result = await discountCodeCollection.find({ _id: o_id }).toArray();
    res.send(result[0])
})


  app.delete("/products/:id",cors(),async(req,res)=>{
    //find detail Nomad with id
    var o_id = new ObjectId(req.params["id"]);
    const result = await productCollection.find({_id:o_id}).toArray();
    //update json Nomad into database
    await productCollection.deleteOne(
    {_id:o_id}
    )
    //send Fahsion after remove
    res.send(result[0])
    })

    app.delete("/discountCode/:id", cors(), async (req, res) => {
      var o_id = new ObjectId(req.params["id"]);
      const result = await discountCodeCollection.find({ _id: o_id }).toArray();
      await discountCodeCollection.deleteOne(
          { _id: o_id }
      )
      res.send(result[0])
  })



// Maintain Geo in Checkout Page
app.get("/geodata", cors(), async(req, res)=>{
  const result = await geoDataCollection.find({}).toArray();
  res.send(result)
})

// Maintain Order
app.get("/orders", cors(), async (req, res) => {
  const result = await orderCollection.find({}).toArray();
  res.send(result)
})

app.get("/orders/:id", cors(), async (req, res) => {
  _id = req.params["id"];
  let c = orderCollection.find(x => x._id == _id)
  res.send(c)
})

app.post("/orders", cors(), async (req, res) => {
  await orderCollection.insertOne(req.body)
  res.send(req.body)
})


app.put("/orders", cors(), async (req, res) => {
  await orderCollection.updateOne(
      { _id: new ObjectId(req.body._id) },
      {
          $set: {
              orderId: req.body.orderId,
              created: req.body.created,
              checkOutInfo: req.body.checkOutInfo,
              orderItemList: req.body.orderItemList,
              grandTotal: req.body.grandTotal,
              discountAmount: req.body.discountAmount,
              shippingFee: req.body.shippingFee,
              shippingFeeDiscount: req.body.shippingFeeDiscount,
              codeUsed: req.body.codeUsed,
              payment: req.body.payment,
              status: req.body.status,
              updated: req.body.updated,
              transferContent: req.body.transferContent,
              orderNote: req.body.orderNote
          }
      })
  var o_id = new ObjectId(req.body._id);
  const result = await orderCollection.find({ _id: o_id }).toArray();
  res.send(result[0])
})


app.delete("/orders/:id", cors(), async (req, res) => {
  var o_id = new ObjectId(req.params["id"]);
  const result = await orderCollection.find({ _id: o_id }).toArray();
  await orderCollection
  res.send(result[0])
})




app.get("/admin",cors(),async (req,res)=>{
  const result = await adminCollection.find({}).toArray();
  res.send(result)
  })
  app.get("/admin/:id", cors(), async (req, res) => {
      try {
        const o_id = new ObjectId(req.params["id"]);
        const result = await adminCollection.findOne({_id: o_id},{ maxTimeMS: 30000 });
    
        if (result) {
          console.log(result);
          res.send(result);
        } else {
          res.status(404).send({ message: "Fashion not found" });
        }
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Internal server error" });
      }
  });
  app.delete("/admin/:id",cors(),async(req,res)=>{
      //find detail Fashion with id
      var o_id = new ObjectId(req.params["id"]);
      const result = await adminCollection.find({_id:o_id}).toArray();
      //update json Fashion into database
      await adminCollection.deleteOne(
      {_id:o_id}
      )
      //send Fahsion after remove
      res.send(result[0])
  })
  app.put("/admin",cors(),async(req,res)=>{
    //update json Fashion into database
    await adminCollection.updateOne(
    {_id:new ObjectId(req.body._id)},//condition for update
    { $set: { 
        first: req.body.first,
       lastname:req.body.lastname,
       email:req.body.email,
       phone:req.body.phone,
      gender:req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      isAdmin:req.body.isAdmin      }
    } )
    //send Fahsion after updating
    var o_id = new ObjectId(req.body._id);
    const result = await adminCollection.find({_id:o_id}).toArray();
    res.send(result[0])
})









app.get("/blog",cors(),async (req,res)=>{
    const result = await PostCollection.find({}).sort().toArray();
    res.send(result)
    }
)
app.get("/:style",cors(),async (req,res)=>{
    const style = req.params.style;
    const filter = { style }
    const result = await PostCollection.find(filter).toArray();
    res.send(result)
    }
)

app.get("/blog/:id", cors(), async (req, res) => {
    try {
      const o_id = new ObjectId(req.params["id"]);
      const result = await PostCollection.findOne({_id: o_id});
  
      if (result) {
        console.log(result);
        res.send(result);
      } else {
        res.status(404).send({ message: "Post not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).send({ message: "Internal server error" });
    }
});

app.post("/blog",cors(),async(req,res)=>{
    await PostCollection.insertOne(req.body)
    res.send(req.body)
})

app.put("/blog",cors(),async(req,res)=>{
   
    await PostCollection.updateOne(
    {_id:new ObjectId(req.body._id)},
    { $set: {
        title: req.body.title,
        content:req.body.content,
        style:req.body.style,
        thumbnail:req.body.thumbnail,
        author: req.body.author,
        date:req.body.date
    }
    } )

    var o_id = new ObjectId(req.body._id);
    const result = await PostCollection.find({_id:o_id}).toArray();
    res.send(result[0])
})

app.delete("/blog/:id",cors(),async(req,res)=>{
   
    var o_id = new ObjectId(req.params["id"]);
    const result = await PostCollection.find({_id:o_id}).toArray();
   
    await PostCollection.deleteOne(
    {_id:o_id}
    )
  
    res.send(result[0])
})
