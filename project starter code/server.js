import express from 'express';
import bodyParser from 'body-parser';
import {filterImageFromURL, deleteLocalFiles} from './util/util.js';
import { URL } from 'url';


  // Init the Express application
  const app = express();

  // Set the network port
  const port = process.env.PORT || 8082;
  
  // Use the body parser middleware for post requests
  app.use(bodyParser.json());

  // @TODO1 IMPLEMENT A RESTFUL ENDPOINT
  // GET /filteredimage?image_url={{URL}}
  // endpoint to filter an image from a public url.
  // IT SHOULD
  //    1
  //    1. validate the image_url query
  //    2. call filterImageFromURL(image_url) to filter the image
  //    3. send the resulting file in the response
  //    4. deletes any files on the server on finish of the response
  // QUERY PARAMATERS
  //    image_url: URL of a publicly accessible image
  // RETURNS
  //   the filtered image file [!!TIP res.sendFile(filteredpath); might be useful]

    /**************************************************************************** */

  //! END @TODO1

  app.get("/filteredimage", async (req, res) => {
    try {
      let image_url = req.query.image_url;
      
      // Check exist and valid
      if (!image_url) {
        return res.status(400).send("Bad request: Image URL parameter missing");
      }

      // Validate image_url
      try {
        new URL(image_url);
      } catch (error) {
        console.log(error)
        return res.status(400).send("Bad request: Invalid URL");
      }

      // Filter the image
      const filteredImage = await filterImageFromURL(image_url);

      // Send result
      res.status(200).sendFile(filteredImage, {}, (err) => {
        if (err) {
          console.error("Send file error:", err);
        } else {
          // Response success: Delete local file
          deleteLocalFiles([filteredImage]);
        }

      });
    } catch (error) {
      console.log('Error', error);
      res.status(500).send(`[Error ${error.errno || 500}] Unexpected error, plz check server log !`);
    }
  });
  
  // Root Endpoint
  // Displays a simple message to the user
  app.get( "/", async (req, res) => {
    res.send("try GET /filteredimage?image_url={{}}")
  } );
  

  // Start the Server
  app.listen( port, () => {
      console.log( `server running http://localhost:${ port }` );
      console.log( `press CTRL+C to stop server` );
  } );
