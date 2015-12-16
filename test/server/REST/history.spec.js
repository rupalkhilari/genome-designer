import { expect } from 'chai';
import { Project as exampleProject } from '../../schemas/_examples';
import { set as dbSet } from '../../../server/utils/database';
import request from 'supertest';
import devServer from '../../../server/devServer';

describe('REST', () => {
  let server;
  const sessionkey = '123456';
  const proj1 = exampleProject;

  beforeEach('server setup', () => {
    server = devServer.listen();
    return dbSet(sessionkey, {});
  });
  afterEach(() => {
    server.close();
  });

  describe('History', () => {
    //use old function syntax to create new scope so can call this.timeout
    it('logs ancestors and descendants in correct order when cloned repeatedly', function historyAncestryTest(done) {
      this.timeout(10000);

      let pid1;
      let pid2;
      let pid3;
      let pid4;

      request(server)
        .post('/api/project')
        .set('sessionkey', sessionkey)
        .send(proj1)
        .expect((res) => { //proj1 = new project
          pid1 = res.body.id;
        })
        .expect(200, cloneOne);

      function cloneOne() {
        request(server)
          .post('/api/clone/' + pid1)
          .set('sessionkey', sessionkey)
          .expect((res) => { //proj2 = proj1.clone
            pid2 = res.body.id;
          })
          .expect(200, cloneTwo);
      }

      function cloneTwo() {
        request(server)
          .post('/api/clone/' + pid2)
          .set('sessionkey', sessionkey)
          .expect((res) => {  //proj3 = proj2.clone
            pid3 = res.body.id;
          })
          .expect(200, cloneThree);
      }

      function cloneThree() {
        request(server)
          .post('/api/clone/' + pid3)
          .set('sessionkey', sessionkey)
          .expect((res) => {  //proj4 = proj3.clone
            pid4 = res.body.id;
          })
          .expect(200, checkAncestors);
      }

      function checkAncestors() {
        request(server)
          .get('/api/ancestors/' + pid4)
          .set('sessionkey', sessionkey)
          .expect((res) => {  //proj4 = proj3.clone

            //expect parents in correct order
            expect(res.body[0] === pid3);
            expect(res.body[1] === pid2);
            expect(res.body[2] === pid1);
          })
          .expect(200, checkDescendants);
      }

      function checkDescendants() {
        request(server)
          .get('/api/descendants/' + pid1)
          .set('sessionkey', sessionkey)
          .expect((res) => {  //proj4 = proj3.clone
            //expect parents in correct order
            expect(Object.keys(res.body.leaves).length === 1);
            expect(Object.keys(res.body).length === 5);
          })
          .expect(200, done);
      }
    });
  });
});
