/**
 * @license Copyright (c) 2003-2014, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.html or http://ckeditor.com/license
 */

CKEDITOR.editorConfig = function( config ) {
	// Define changes to default configuration here. For example:
	// config.language = 'fr';
	// config.uiColor = '#AADC6E';
	
	config.allowedContent = true;
	config.toolbar = '2WEB';
	config.toolbar_2WEB =
	[
	 	['Source','Paste','PasteText','PasteFromWord'],
		['OrderedList','UnorderedList'],
		['Bold','Italic','Underline'],
		['Link','Unlink','Anchor'],
		['JustifyLeft','JustifyCenter','JustifyRight','JustifyBlock','NumberedList','BulletedList'],
		'/',
		['Styles','Format','Font','FontSize'],
		['TextColor','BGColor'],['Maximize','-','About']	// No comma for the last row.		
		
	];
	config.contentsCss = '/public/css/style_ck.css';
};
