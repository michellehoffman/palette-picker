const chai = require('chai');
const should = chai.should();
const chaiHttp = require('chai-http');
const server = require('../server');

chai.use(chaiHttp);

const environment = process.env.NODE_ENV || 'test';
const configuration = require('../knexfile')[environment];
const database = require('knex')(configuration);

describe('Client Routes', () => {
  it('should return the homepage with text', () => {
    return chai.request(server)
    .get('/')
    .then(response => {
      response.should.have.status(200);
      response.should.be.html;
    })
    .catch(error => {
      throw error;
    });
  });

  it('should return a 404 response if the route does not exist', () => {
    return chai.request(server)
    .get('/lagakhk')
    .then(response => {
      response.should.have.status(404);
    })
    .catch(error => {
      throw error;
    });
  });
});

describe('API Routes', () => {
  beforeEach((done) => {
    database.migrate.rollback()
    .then(() => {
      database.migrate.latest()
      .then(() => {
        return database.seed.run()
        .then(() => {
          done()
        })
      })
    })
  })

  describe('GET /api/v1/projects', () => {
    it('should return all of the projects', () => {
      return chai.request(server)
      .get('/api/v1/projects')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Project 1');
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('GET /api/v1/projects/1/palettes', () => {
    it('should return all of the palettes for a certain project', () => {
      return chai.request(server)
      .get('/api/v1/projects/1/palettes')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('array');
        response.body.length.should.equal(1);
        response.body[0].should.have.property('id');
        response.body[0].id.should.equal(1);
        response.body[0].should.have.property('name');
        response.body[0].name.should.equal('Fire');
        response.body[0].should.have.property('colors');
        response.body[0].colors.should.be.a('array');
        response.body[0].colors[0].should.equal('#000000');
        response.body[0].colors[1].should.equal('#FFFFFF');
        response.body[0].colors[2].should.equal('#FCF015');
        response.body[0].colors[3].should.equal('#EF4AB7');
        response.body[0].colors[4].should.equal('#3AD784');
        response.body[0].should.have.property('project_id');
        response.body[0].project_id.should.equal(1);      
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('POST /api/v1/projects', () => {
    it('should create a new project', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({
        name: 'My Project'
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
      })
      .catch(error => {
        throw error;
      });
    });

    it('should not create a new project with missing data', () => {
      return chai.request(server)
      .post('/api/v1/projects')
      .send({
        // name: 'My Project'
      })
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format: { name: <String> }. You're missing a name property.`)
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('GET /api/v1/palettes/1', () => {
    it('should return the palettes with id of 1', () => {
      return chai.request(server)
      .get('/api/v1/palettes/1')
      .then(response => {
        response.should.have.status(200);
        response.should.be.json;
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(1);
        response.body.should.have.property('name');
        response.body.name.should.equal('Fire');
        response.body.should.have.property('colors');
        response.body.colors.should.be.a('array');
        response.body.colors[0].should.equal('#000000');
        response.body.colors[1].should.equal('#FFFFFF');
        response.body.colors[2].should.equal('#FCF015');
        response.body.colors[3].should.equal('#EF4AB7');
        response.body.colors[4].should.equal('#3AD784');
        response.body.should.have.property('project_id');
        response.body.project_id.should.equal(1);      
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('POST /api/v1/palettes', () => {
    it('should create a new palette', () => {
      return chai.request(server)
      .post('/api/v1/palettes')
      .send({
        name: 'Water',
        colors: ['#000000', '#FFFFFF', '#FCF015', '#EF4AB7', '#3AD784'],
        project_id: 1
      })
      .then(response => {
        response.should.have.status(201);
        response.body.should.be.a('object');
        response.body.should.have.property('id');
        response.body.id.should.equal(2);
      })
      .catch(error => {
        throw error;
      });
    });

    it('should not create a new palette with missing data', () => {
      return chai.request(server)
      .post('/api/v1/palettes')
      .send({
        // name: 'Water',
        colors: ['#000000', '#FFFFFF', '#FCF015', '#EF4AB7', '#3AD784'],
        project_id: 1
      })
      .then(response => {
        response.should.have.status(422);
        response.body.error.should.equal(`Expected format: { name: <String>, colors: <Array>, project_id: <Number> }. You're missing a name property.`)
      })
      .catch(error => {
        throw error;
      });
    });
  });

  describe('DELETE /api/v1/palettes/:id', () => {
    return chai.request(server)
    .delete('/api/v1/palettes/1')
    .then(response => {
      response.should.have.status(204)
    })
    .catch(error => {
      throw error;
    });
  });
});