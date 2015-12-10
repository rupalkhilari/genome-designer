/* eslint-disable */

import { expect } from 'chai';
import { Block as exampleBlock, Project as exampleProject } from '../../schemas/_examples';
import request from 'supertest';
import { set as dbSet } from '../../../server/database';

const devServer = require('../../../devServer');

describe('REST', () => {
  
  let server;
  const sessionKey = '123456';
  const proj1 = exampleProject;

  beforeEach('server setup', () => {
    server = devServer.listen();
    return dbSet(sessionKey, {});
  });
  afterEach(() => {
    server.close();
  });

  const extendedBlock = Object.assign({}, exampleBlock, {
    some: 'field',
  });

  describe('History', () => {

    it('logs ancestors and descendants in correct order when cloned repeatedly', (done) => {
      let pid1,
          pid2,
          pid3,
          pid4;

      request(server).post('/api/project').set('sessionKey', sessionKey)
          .send(proj1)
          .expect(200)
          .expect((res) => { //proj1 = new project
            pid1 = res.body.id;

            request(server).post('/api/clone/'+pid1).set('sessionKey', sessionKey)
              .expect(200)
              .expect((res) => { //proj2 = proj1.clone
                pid2 = res.body.id;
                request(server).post('/api/clone/'+pid2).set('sessionKey', sessionKey)
                  .expect(200)
                  .expect((res) => {  //proj3 = proj2.clone
                    pid3 = res.body.id;
                    request(server).post('/api/clone/'+pid2).set('sessionKey', sessionKey)
                      .expect(200)
                      .expect((res) => {  //proj4 = proj3.clone                        
                        pid4 = res.body.id;              
                        request(server).get('/api/ancestors/'+pid4).set('sessionKey', sessionKey)
                          .expect(200)
                          .expect((res) => {  //proj4 = proj3.clone
                            
                            //expect parents in correct order
                            expect(res.body[0]===pid3);
                            expect(res.body[1]===pid2);
                            expect(res.body[2]===pid1);

                          });

                        request(server).get('/api/descendants/'+pid1).set('sessionKey', sessionKey)
                          .expect(200)
                          .expect((res) => {  //proj4 = proj3.clone
                            
                            //expect parents in correct order
                            expect(Object.keys(res.body.leaves).length===1);
                            expect(Object.keys(res.body).length===5);

                          });
                        
                      });

                  });               
              });

          }).end(done);

    });
  });    
});
