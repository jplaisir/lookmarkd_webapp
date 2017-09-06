'use strict';
module.exports = function(grunt, options) {
    var parseurl = require('parseurl');

    // just a helper to prevent double config
    function bsOptions() {
    	var bsOptions = {
    			watchTask: true,
                notify: true,
                open: true,
                ghostMode: {
                    clicks: true,
                    scroll: true,
                    links: true,
                    forms: true
                }
    	};
    	
    	if(!options.useproxy) {
    		bsOptions['server'] = {
                    baseDir: Array.prototype.slice.call(arguments),
                    middleware: [
                                 function(req, res, next) {
                                     var obj = parseurl(req);
                                     if (!/\.\w{2,}$/.test(obj.pathname) || /\.php/.test(obj.pathname)) {
                                         grunt.bsMiddleware(req, res, next);
                                     } else {
                                         next();
                                     }
                                 }
                             ]
                };
    		bsOptions['port'] = parseInt(options.env.port, 10);
    	} else {
    		bsOptions['proxy'] = {
    				middleware: [
    			                    function(req, res, next) {
    			                        var obj = parseurl(req);
    			                        if (!/\.\w{2,}$/.test(obj.pathname) || /\.php/.test(obj.pathname)) {
    			                            grunt.bsMiddleware(req, res, next);
    			                        } else {
    			                            next();
    			                        }
    			                    }
    			                ]
    		};
    		bsOptions['proxy']['target'] = options.proxy;
    		
    	}
        return bsOptions;
    }

    return {
        dev: {
            bsFiles: {
                src: [
                    '<%= paths.app %>/scripts/**/*.js',
                    '<%= paths.app %>/images/**/*.{jpg,jpeg,gif,png,webp}',
                    'app/Resources/views/*.html.twig',
                    'app/Resources/views/**/*.html.twig',
                    '.tmp/styles/*.css'
                ]
            },
            options: bsOptions('.tmp', '<%= paths.app %>', './', 'bower_components', '<%= paths.dist %>')
        },
        dist: {
            bsFiles: {src: []},
            options: bsOptions('<%= paths.dist %>')
        }
    };
};
