process.env.NODE_ENV = 'test';

const {expect} = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const seed = require('../seed/test.seed');
const PORT = require('../config').PORT[process.env.NODE_ENV];
const ROOT = `http://localhost:${PORT}/api`;

var article_id;

require('../server');

before(done => {
  mongoose.connection.once('connected', () => {
    mongoose.connection.db.dropDatabase(() => {
      console.log('Dropped database');
      seed(done);
    });
  });
});

describe('API ROUTES', () => {
  describe('GET /api', () => {
    it('returns status code 200', (done) => {
      request(ROOT)
        .get('/')
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.eql({status:'OK'});
          done();
        });
    });
  });

  describe('GET /api/articles', () => {
    it('returns the articles and status code 200', (done) => {
      request(ROOT)
        .get('/articles')
        .end((error, res) => {
          article_id = res.body.articles[0]._id;

          expect(res.statusCode).to.equal(200);
          expect(res.body.articles).to.be.an('array');
          
          res.body.articles.forEach(article => {
            expect(article.title).to.be.a('string');
            expect(article.body).to.be.a('string');
            expect(article.comment_count).to.be.a('number');
          });
          
          done();
        });
    });
  });

  describe('GET /api/topic', () => {
    it('returns the topics and status code 200', (done) => {
      request(ROOT)
        .get('/topics')
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.topics).to.be.an('array');
          done();
        });
    });
  });

  describe('POST /api/comments', () => {
    it('returns the created comment and status code 201', (done) => {
      request(ROOT)
        .post(`/articles/${article_id}/comments`)
        .send({'body': 'test'})
        .set('Accept', 'application/json')
        .end((error, res) => {
          expect(res.statusCode).to.equal(201);
          expect(res.body.comment.body).to.eql('test');
          done();
        });
    });
  });
});