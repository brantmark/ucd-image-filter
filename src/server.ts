import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util';

(async () => {

  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // Filter an image from a public url
  app.get( "/filteredimage", async ( req, res ) => {
    const { image_url } = req.query;

    try {
      new URL(image_url);
    } catch (err) {
      return res.status(400).send({ message: 'A valid image_url is required' });
    }

    try {
      const filtered_image_path = await filterImageFromURL(image_url)
      res.sendFile(filtered_image_path, () => deleteLocalFiles([filtered_image_path]))
    } catch (error) {
      return res.status(422).send({ message: 'Unable to process url as image' });
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async ( req, res ) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
})();