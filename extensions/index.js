import express from 'express';
import bodyParser from 'body-parser';
import { run } from './cloudRun';
const router = express.Router(); //eslint-disable-line new-cap
const jsonParser = bodyParser.json({
  strict: false, //allow values other than arrays and objects
});


router.post('/run/:id', jsonParser, (req, resp) => {
  const { id } = req.params;
  const data = req.body;
  console.log(id);
  run(id).then(
    function(res) {
      resp.json({"hello": "world"});
    }
  );
});


module.exports = router;
