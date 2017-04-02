process.env.NODE_ENV = 'test';

const {expect} = require('chai');
const request = require('supertest');
const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const saveTestData = require('../seed/test.seed');
const PORT = require('../config').PORT[process.env.NODE_ENV];
const ROOT = `http://localhost:${PORT}/api`;

require('../server');

describe('API ROUTES', () => {
  let sampleIds, invalidId, incorrectId;

  before(done => {
    mongoose.connection.once('connected', () => {
      mongoose.connection.db.dropDatabase(() => {
        console.log('Dropped database');

        saveTestData((idObj) => {
          sampleIds = idObj;
          // also save some invalid IDs to test for errors
          // explain the difference between an invalid/incorrect ID
          invalidId = sampleIds.article_id.toString().split('');
          invalidId[invalidId.length - 1] =  '5345';
          invalidId = invalidId.join('');
          // take an ID from another database
          incorrectId = '5841a06fed9db244975922c3';
          done();  
        });
      });
    });
  });

  after(done => {
    mongoose.connection.db.dropDatabase(() => {
      console.log('Tests completed');
      done();
    });
  });

  describe('GET /api', () => {
    it('returns status code 200', (done) => {
      request(ROOT)
        .get('/')
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body).to.eql({status: 'OK'});
          done();
        });
    });

    it('handles invalid routes', (done) => {
      request(ROOT)
        .get('/notfound')
        .end((error, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.eql({reason: 'Not found'});
          done();
        });
    });
  });

  describe('GET /api/topic', () => {
    it('returns status code 200', (done) => {
      request(ROOT)
        .get('/topics')
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          expect(res.body.topics.length).to.equal(3);
          done();
        });
    });

    it('returns an array with the topics', (done) => {
      request(ROOT)
        .get('/topics')
        .end((error, res) => {
          expect(res.body.topics.length).to.equal(3);
          
          res.body.topics.forEach(topic => {
            expect(topic._id).to.be.a('string');
            expect(topic.title).to.be.a('string');
            expect(topic.slug).to.be.a('string');
          });

        done();
      });
    });
  });

  describe('GET /api/topics/:topic_id/articles', () => {
    it('returns status code 200 for valid inputs', (done) => {
      request(ROOT)
        .get('/topics/football/articles')
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('returns an array with the articles of a particular topic', (done) => {
      request(ROOT)
        .get('/topics/football/articles')
        .end((error, res) => {
          expect(res.body.articles.length).to.equal(1);
          
          let actual = res.body.articles.every((article) => {
            return article.belongs_to === 'football';
          });
          expect(actual).to.be.true;
          
          done();
        });
    });

    it('handles not found topics', (done) => {
      request(ROOT)
        .get('/topics/test/articles')
        .end((error, res) => {
          expect(res.statusCode).to.equal(204);
          done();
        });
    });

    it('handles invalid routes', (done) => {
      request(ROOT)
        .get('/topics/football/test')
        .end((error, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.eql({reason: 'Not found'});
          done();
        });
    });
  });

  describe('GET /api/articles', () => {
    it('returns status code 200', (done) => {
      request(ROOT)
        .get('/articles')
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('returns an array with the articles', (done) => {
      request(ROOT)
        .get('/articles')
        .end((error, res) => {
          expect(res.body.articles.length).to.equal(2);
          
          let actual = res.body.articles.some((article) => {
            return article._id === sampleIds.article_id.toString();
          });

          expect(actual).to.be.true;

          res.body.articles.forEach(article => {
            expect(article._id).to.be.a('string');
            expect(article.title).to.be.a('string');
            expect(article.body).to.be.a('string');
            expect(article.comment_count).to.be.a('number');
            expect(article.votes).to.be.a('number');
            expect(article.belongs_to).to.be.a('string');
          });
          
          done();
        });
    });
  });

  describe('GET /api/articles/:article_id/comments', () => {
    it('returns status code 200 for valid inputs', (done) => {
      request(ROOT)
        .get(`/articles/${sampleIds.article_id}/comments`)
        .end((error, res) => {
          expect(res.statusCode).to.equal(200);
          done();
        });
    });

    it('returns an array with the comments of a particular article', (done) => {
      request(ROOT)
        .get(`/articles/${sampleIds.article_id}/comments`)
        .end((error, res) => {
          expect(res.body.comments.length).to.equal(2);
          
          let actual = res.body.comments.every((comment) => {
            return comment.belongs_to === sampleIds.article_id.toString();
          });
          expect(actual).to.be.true;

          res.body.comments.forEach(comment => {
            expect(comment._id).to.be.a('string');
            expect(comment.body).to.be.a('string');
            expect(comment.votes).to.be.a('number');
            expect(comment.belongs_to).to.be.a('string');
            expect(comment.created_by).to.be.a('string');
            expect(comment.created_at).to.be.a('number');
          });
          
          done();
        });
    });

    it('handles not found comments', (done) => {
      request(ROOT)
        .get(`/articles/${incorrectId}/comments`)
        .end((error, res) => {
          expect(res.statusCode).to.equal(204);
          done();
        });
    });

    it('handles invalid ids', (done) => {
      request(ROOT)
        .get(`/articles/${invalidId}/comments`)
        .end((error, res) => {
          expect(res.statusCode).to.equal(400);
          expect(res.body).to.eql({reason: 'Invalid id'});
          done();
        });
    });

    it('handles invalid routes', (done) => {
      request(ROOT)
        .get(`/articles/${sampleIds.article_id}/test`)
        .end((error, res) => {
          expect(res.statusCode).to.equal(404);
          expect(res.body).to.eql({reason: 'Not found'});
          done();
        });
    });
  });

  describe('PUT /api/articles/:article_id', () => {
    it('returns status code 204 for valid inputs', () => {
      
    });
  });

  describe('POST /api/comments', () => {
    it('returns the created comment and status code 201', (done) => {
      request(ROOT)
        .post(`/articles/${sampleIds.article_id}/comments`)
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
