const proxy = [
    {
      context: ['/api'],
      target: 'http://infohub.dev.edm.container.btgpactual.net',
      secure: false,
      pathRewrite: {'^/api' : ''}
    }
  ];
  module.exports = proxy;