import express from 'express';
import bodyParser from 'body-parser';
import fsharp from 'fsharp';
import crypto from 'crypto';
import fs from 'fs';
import { exec } from 'child_process';


const router = express.Router();
const jsonParser = bodyParser.json({
	strict: false,
});

// parse various different custom JSON types as JSON
router.use(bodyParser.json({ type: 'application/*+json' }))

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
  	const filePath = '/tmp/' + filename + ".fsx";
  	// write out a file with the code.
  	fs.writeFile(filePath, content, function(err) {
  		if (err) {
  			console.log(err);
  			return res.status(500).send('error!');
  		}
  		// execute the code
  		console.log("Running: ", 'fsharpi ', filePath);
			exec(`fsharpi ${filePath}`, (err, stdout, stderr) => {
				let output = '';
				if (err) {
					//return res.status(500).send('error!');
					output = stderr;
				}
				else {
					output = stdout;
				}
				const result = {
					"result" : output,
				}
				res.status(200).json(result);
			});
			// TODO: Remove the file once done, make sure the deletion is done carefully.
			
  	});

	});
});


router.post('/fsharpcmd', jsonParser, (req, res, next) => {
	const input = req.body;
	const content = input.code;
	exec(`echo ${content}`, (err, stdout, stderr) => {
		if (err) {
			return res.status(500).send('error!');
		}
		const result = {
			"result" : stdout,
			"duration" : "TimeToExecute"
		}
		res.status(200).json(result);
	});
});


export default router;