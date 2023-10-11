const mongoose=require("mongoose");
const news_schema=new mongoose.Schema(
    {   data: [
        {
          // Define the structure of objects within the array
          publish_date: String,
          headline_text: String,
          // ... Define more subfields as needed
        }
      ]
      },
    {versionKey:false}
);

module.exports=mongoose.model("news_collection",news_schema);