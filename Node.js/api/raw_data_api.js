const news_schema=require("../mongo_schema/raw_new_schema");
const ObjectId = require('mongoose').Types.ObjectId;
const get_data=async ()=>{
    try{   
        const data=await news_schema.find();
        return data;
 }
 catch(error)
 { 
     return 0;
 }
}

const set_data=async (news)=>{
    try{ 
       const Data=await news_schema.create(news);
        return Data;
}
catch(error){
    return 0;
}
}

  

const update_data=async (tmp)=>{
    
     console.log(tmp,"dddd")

    const objectIdToFind = '6526440865c3a535eef20f27'; // Replace with your ObjectID

    const data = await news_schema.updateOne({ _id: objectIdToFind },{$set:{"data":tmp}});
        return data;

}
const filter_data= async (number,type)=>{
   try{
          const data=news_schema.aggregate([
            {
              $unwind: "$data" // Split the array into separate documents
            },
            {
              $sort: {
                "data.entities": -1 // Sort by the 'publish_date' field in descending order
              }
            },
            {
              $group: {
                _id: "$_id",
                data: { $push: "$data" }
              }
            },
            {
              $project: {
                _id: 0, // Exclude the _id field from the result
                data: { $slice: ["$data", number] } // Limit the 'data' array to the top 100 elements
              }
            }
          ])
          return data;
   }catch(err)
   { return err;}
}
const min_entity=async (req,res)=>{
    try{ 
         const data=await news_schema.find({
            "data.entities": {
              $elemMatch: {
                $in: ["entity_name"] // Replace "entity_name" with the name you want to search for
              }
            }
          })
          return data;

    }catch(error)
    {
        return error;
    }
}
module.exports={get_data,set_data,update_data,filter_data,min_entity};