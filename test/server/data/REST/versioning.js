import { expect } from 'chai';
import request from 'supertest';
import Project from '../../../../src/models/Project';
import * as persistence from '../../../../server/data/persistence';
import devServer from '../../../../server/devServer';

describe('REST', () => {
  describe('Data', () => {
    describe('Versioning', () => {
      let server;
      const initialFields = {initial: 'value'};
      const projectData = new Project(initialFields);
      const projectId = projectData.id;

      before(() => {
        return persistence.projectCreate(projectId, projectData);
      });

      beforeEach('server setup', () => {
        server = devServer.listen();
      });
      afterEach(() => {
        server.close();
      });

      it('POST project creates commit');
      it('POST block creates commit');

      it('/commit/ route creates a snapshot');
    });
  });
});
