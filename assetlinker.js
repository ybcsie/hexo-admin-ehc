'use strict';

const url = require('url');
let cheerio;

const rAssetlink = /-*\s*assetlinker\s*-*/i;

function assetlinkerHelper(content, path) {
	var url_for_post = this.url_for(path)
	if (!url_for_post)
		return content

	if (!rAssetlink.test(content))
		return content

	if (!cheerio) cheerio = require('cheerio');
	const $ = cheerio.load(content, { decodeEntities: false });

	$('*').contents().each(function () {
		if (this.type != 'comment')
			return;

		if (!this.data)
			return;

		if (!rAssetlink.test(this.data))
			return;

		var tag = this.next;
		if (!tag.name)
			return;
		var attr;


		if (tag.name == 'img' && tag.attribs['src'])
			attr = 'src'

		else if (tag.name == 'a' && tag.attribs['href'])
			attr = 'href'

		else
			return;

		const data = url.parse(tag.attribs[attr]);

		// Exit if the link have protocol, which means it's a external link
		if (data.protocol) return;


		tag.attribs[attr] = url_for_post + tag.attribs[attr]


	});

	return $.html()

}

module.exports = assetlinkerHelper;
