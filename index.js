var serveStatic = require('serve-static'),
	bodyParser = require('body-parser'),
	path = require('path'),
	api = require('./api'),
	upload = require('./upload');

var passwordProtected = hexo.config.admin && hexo.config.admin.username;

// verify that correct config options are set.

var config_ok = true;
if (!hexo.config.post_asset_folder) {
	config_ok = false
	console.error('[Hexo Admin]: config post_asset_folder has to be true');
}

if (!config_ok) {
	hexo.extend.filter.register('server_middleware', function (app) {
		app.use(hexo.config.root + 'admin/', serveStatic(path.join(__dirname, 'www/unconfig')));
	});

}
else {

	if (passwordProtected) {
		if (!hexo.config.admin.password_hash) {
			console.error('[Hexo Admin]: config admin.password_hash is requred for authentication');
			passwordProtected = false;
		} else if (hexo.config.admin.password_hash.length <= 32) {
			throw new Error('[Hexo Admin]: the provided password_hash looks like an md5 hash -- hexo-admin has switched to use bcrypt; see the Readme for more info.')
		}

		if (!hexo.config.admin.secret) {
			console.error('[Hexo Admin]: config admin.secret is requred for authentication');
			passwordProtected = false;
		}

	}

	hexo.extend.filter.register('server_middleware', function (app) {

		if (passwordProtected) {
			require('./auth')(app, hexo);   // setup authentication, login page, etc.
		}

		// Main routes
		app.use(hexo.config.root + 'admin/', serveStatic(path.join(__dirname, 'www')));
		app.use(hexo.config.root + 'admin/api/', bodyParser.json({ limit: '50mb' }));

		// setup the json api endpoints
		api(app, hexo);
		// handle multifiles upload @2018/02/11
		upload(app, hexo);

	});

}