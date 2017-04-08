module.exports = {
  DB: {
    test: 'mongodb://localhost/northcoders-news-api-test',
    dev: 'mongodb://localhost/northcoders-news-api',
    production: 'mongodb://user:password@ds035046.mlab.com:35046/northcoders_news'
  },
  PORT: {
    test: 3090,
    dev: 3000,
    production: process.env.PORT
  }
};