import express from 'express';
import bodyParser from 'body-parser';
import crypto from 'crypto';
import fs from 'fs';
import { exec } from 'child_process';


const router = express.Router();
const jsonParser = bodyParser.json({
	strict: false,
});

// parse various different custom JSON types as JSON
//router.use(bodyParser.json({ type: 'application/*+json' }))

/*
 fetch('/fsharp/compile', {  
    method: 'POST',
    headers: {  
      "Content-type": "application/json; charset=UTF-8"  
    },
    body: JSON.stringify({my: 'object'}),
  }).then(resp => resp.json()).then(test => console.log(test)); 
*/

router.post('/fsharp', jsonParser, (req, res, next) => {
  const input = req.body;
  const content = input.code;

  crypto.randomBytes(16, function(err, buffer) {
  	const filename = buffer.toString('hex');
  	const filePath = '/tmp/' + filename + '.fsx';
    let output = '';

  	// write out a file with the code.
  	fs.writeFile(filePath, content, function(err) {

  		if (err) {
  			console.log(err);
  			//return res.status(500).send('Unable to write temp file.');
  		}
  		// execute the code
  		console.log('Running: ', 'fsharpi ', filePath);
			const process = exec(`fsharpi ${filePath}`, (err, stdout, stderr) => {
				//if (err) return res.status(500).send('error!');
			});

      process.stdout.on('data', function(data) {
        output = data;
      });

      process.stderr.on('data', function(data) {
        output = data;
      });
      // find the exit code of the process.
      process.on('exit', function(code) {
        console.log('Child process exited with a exit code of ', code);
        const result = {
          'result' : output,
          'status' : code,
        }
        res.status(200).json(result);
      });

			// TODO: Remove the file once done, make sure the deletion is done carefully.
    });

	});
});

export default router;
