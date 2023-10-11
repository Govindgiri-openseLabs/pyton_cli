const fs = require('fs');
const csv = require('csv-parser');
const { set_data,get_data,update_data ,filter_data,min_entity} = require('../api/raw_data_api');
const Sentiment = require('sentiment');
const compromise = require('compromise');
const { Command } = require('commander');
const { log } = require('console');



const add_raw_data = async (req, res) => {
  try {
    const path = req?.body?.path || null;
    const data = [];
    // Create a Promise to read and process the CSV file
    const importCsvPromise = new Promise((resolve, reject) => {
      // Read and import data from the CSV file
      const startTime=Date.now()
      fs.createReadStream(path)
        .pipe(csv())
        .on('data', (row) => {
            data.push(row);
        })
        .on('end', () => {  
          resolve({"data":data});
        })
        .on('error', (error) => {
          reject(error);
        });
    });

    // Wait for the CSV file import to complete
    const importedData = await importCsvPromise;

    console.log(`Imported data successfully (${importedData.length} rows)`);

    // Save the data into MongoDB
    try {
      
      const result = await set_data(importedData);
      const endTime = Date.now();
      const executionTime = (endTime - startTime) / 1000; // in seconds
      console.log(`Imported data successfully in ${executionTime} seconds`);
      return res.status(200).json({ message: 'Data saved successfully', result });
    } catch (error) {
      return res.status(500).json({ message: 'Error saving data to MongoDB', error });
    }
  } catch (error) {
    console.error('Error:', error);
    return res.status(500).json({ message: 'Error processing the file', error });
  }
};






// Function to extract named entities, determine types, and analyze sentiment
  
 





  


// Function to extract entities and analyze sentiment for a given text
function extractEntitiesAndAnalyzeSentiment(text) {
  const doc = compromise(text);

  // Extract entities (named entities, organizations, locations, etc.)
  const entities = doc.people().out('array').concat(doc.organizations().out('array'), doc.places().out('array'));

  // Analyze the sentiment of the text
  const sentiment = new Sentiment();
  const result = sentiment.analyze(text);

  // Determine the sentiment type based on the score
  let sentimentType;
  if (result.score > 0) {
    sentimentType = 'positive';
  } else if (result.score < 0) {
    sentimentType = 'negative';
  } else {
    sentimentType = 'neutral';
  }

  return {
    entities,
    sentimentResult: sentimentType,
  };
}

// Function to process headlines, extract entities, and analyze sentiment
const extract_entity=async (req,res)=> {
  try {
    // Start measuring execution time
    const startTime = new Date().getTime();

    // Read the CSV file (You can modify this part to read from your data source)
    const Data =await get_data();
    // Placeholder for results
    const results = [];
    //console.log(Data[0].data,"ddddd")
    // return res.send("ok bhai");
    // Process headlines, extract entities, and analyze sentiment
    for (const element of Data[0].data) {
        const analysisResult = extractEntitiesAndAnalyzeSentiment(element['headline_text']);
        analysisResult['headline_text']=element['headline_text'];
        analysisResult['publish_date']=element['publish_date'];
        results.push(analysisResult);
      
    }

    // Calculate execution time
    
    // Return the results or do something with them
    // result={"data":results.result};
     const data=await update_data(results);
     const endTime = new Date().getTime();
    const executionTime = (endTime - startTime) / 1000; // in seconds

    console.log(`Entities extracted and sentiment analyzed in ${executionTime} seconds.`);
    
    return res.send({"data":data});
   
  } catch (error) {
    console.error('Error:', error.message);
  }
}

const top_entity=async (req,res)=>{
    try{
           const number=req?.body?.number||null;
           const type=req?.body?.type||null;
           const startTime=new Date();
           const data=await filter_data(number,type);
           const endTime=new Date();

           console.log(data,"dfghjkjhgfd",(endTime-startTime)/1000)
           return res.send({"data":data});
    }
    catch(error){
return res.send({"error":error})
    }
}

const seprate_entity=async (req,res)=>{
    const type=req?.body?.type;
    try{
           const data=await min_entity(type);
           return res.send({"data":data});
    }
    catch(err)
    {
        res.send({"error":err})
    }
}
module.exports = { add_raw_data ,extract_entity,top_entity,seprate_entity};