var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
let updateid1;
let updateid2;
chai.use(chaiHttp);

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Create an issue with every field: POST', function(done) {
       chai.request(server)
        .post('/api/issues/test1')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.open, true);
          assert.property(res.body, '_id');
          updateid1=res.body._id;
          done();
        });
      });
      
      test('Create an issue with only required fields: POST', function(done) {
        chai.request(server)
        .post('/api/issues/test1')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in');
          assert.property(res.body, 'created_on');
          assert.property(res.body, 'updated_on');
          assert.equal(res.body.open, true);
          assert.property(res.body, '_id');
          updateid2=res.body._id;
          done();
        });
      });
      
      test('Create an issue with missing required fields: POST', function(done) {
        chai.request(server)
        .post('/api/issues/test3')
        .send({
         // issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'required field(s) missing');
          done();
        });
      });
      
    });
    
  suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('View issues on a project: GET request ', function(done) {
        chai.request(server)
        .get('/api/issues/test1')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('View issues on a project with one filter: GET', function(done) {
        chai.request(server)
        .get('/api/issues/test1')
        .query({assigned_to: 'Chai and Mocha'})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
      test('View issues on a project with multiple filters: GET', function(done) {
         chai.request(server)
        .get('/api/issues/test1')
        .query({issue_title:"Title",issue_text: "text"})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body);
          assert.property(res.body[0], 'issue_title');
          assert.property(res.body[0], 'issue_text');
          assert.property(res.body[0], 'created_on');
          assert.property(res.body[0], 'updated_on');
          assert.property(res.body[0], 'created_by');
          assert.property(res.body[0], 'assigned_to');
          assert.property(res.body[0], 'open');
          assert.property(res.body[0], 'status_text');
          assert.property(res.body[0], '_id');
          done();
        });
      });
      
    });
  




    suite('PUT /api/issues/{project} => text', function() {
      test('Update one field on an issue: PUT', function(done) {
        chai.request(server)
        .put('/api/issues/test1')
        .send({
          _id:updateid2,
          issue_title: 'Title12-modified',
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id,updateid2);
          done();
        });
      });
      test('Update multiple fields on an issue: PUT', function(done) {
        chai.request(server)
        .put('/api/issues/test1')
        .send({
          _id:updateid2,
          issue_text: 'text-modified',
          created_by: '(modified) Functional Test - Every field filled in',
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully updated');
          assert.equal(res.body._id,updateid2);
          done();
        });
      });
      

test('Update an issue with missing _id: PUT', function(done) {
         chai.request(server)
        .put('/api/issues/test1')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
      });

      test('Update an issue with no fields to update: PUT', function(done) {
         chai.request(server)
        .put('/api/issues/test1')
        .send({
          _id:updateid2,
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'no update field(s) sent');
          assert.equal(res.body._id,updateid2);
          done();
        });
      });
      
test('Update an issue with an invalid _id: PUT', function(done) {
         chai.request(server)
        .put('/api/issues/test1')
        .send({
          _id:"invalidid",
          issue_text: 'text-modified',
          created_by: '(modified) Functional Test - Every field filled in',
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not update');
          assert.equal(res.body._id,"invalidid");
          done();
        });
      });
      
      
    });
    
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('Delete an issue: DELETE', function(done) {
        chai.request(server)
        .delete('/api/issues/test1')
        .send({
          _id:updateid2,
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.result, 'successfully deleted');
          assert.equal(res.body._id,updateid2);
          done();
        });
      });
      
      test('Delete an issue with an invalid _id: DELETE', function(done) {
        chai.request(server)
        .delete('/api/issues/test1')
        .send({
          _id:"invalid",
       })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'could not delete');
          assert.equal(res.body._id,"invalid");
          done();
        });
      });
      
test('Delete an issue with missing _id: DELETE', function(done) {
         chai.request(server)
        .delete('/api/issues/test1')
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.error, 'missing _id');
          done();
        });
      });

    });

});