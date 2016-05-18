var config = {};

config.session = {
	secret: process.env.SESSION_SECRET || 'username',
	resave: true,
	saveUninitialized: true,
	cookie: {
    	rolling: true,
    	maxAge: 60*60*1000
  	}
}

config.server_port = process.env.OPENSHIFT_NODEJS_PORT || 8080;
config.server_ip_address = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';


module.exports = config;