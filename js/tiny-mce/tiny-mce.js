
(function(){
  tinymce.create('tinymce.plugins.MyPluginName', {
    init: function(ed, url){
      ed.addButton('affiliateshortcodesbtn', {
        title: 'Affiliate Shortcodes',
        cmd: 'insertshortcodescmd',
        text: 'Insert Affiliate Shortcodes'
      });

      ed.addCommand('insertshortcodescmd', function(){
        var shortcodeOne = '<p>[amazon link="ASIN" title="TITLE"]</p>';
        var shortcodeTwo = '<p>[amazon box="ASIN"]</p>';
        var shortcodeThree = '<p>[amazon link="ASIN" link_class="button amazon-button" title="Check Price and Reviews on Amazon"]</p>';
        ed.execCommand('mceInsertContent', 0, shortcodeOne);
        ed.execCommand('mceInsertContent', 0, shortcodeTwo);
        ed.execCommand('mceInsertContent', 0, shortcodeThree);
      });
    },
    getInfo: function() {
      return {
        longname : 'My Custom Buttons',
        author : 'Plugin Author',
        authorurl : 'https://www.axosoft.com',
        version : "1.0"
      };
    }
  });
  tinymce.PluginManager.add( 'mytinymceplugin', tinymce.plugins.MyPluginName );
})();