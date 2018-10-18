'use strict';

let cheerio;

const ASSETLINKER_PRO = "assetlinker://";

function assetlinker(content, url_for_post) {
	if (!url_for_post)
		return content

	if (content.indexOf(ASSETLINKER_PRO) < 0)
		return content

	if (!cheerio) cheerio = require('cheerio');
	const $ = cheerio.load(content, { decodeEntities: false });

	$('*').contents().each(function () {
		if (!this.name)
			return;

		var attr;

		if (this.name == 'img' && this.attribs['src'])
			attr = 'src'

		else if (this.name == 'a' && this.attribs['href'])
			attr = 'href'

		else
			return;


		this.attribs[attr] = this.attribs[attr].replace(ASSETLINKER_PRO, url_for_post);


	});

	return $.html()

}

module.exports = assetlinker;
