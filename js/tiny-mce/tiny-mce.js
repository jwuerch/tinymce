(function($){
  tinymce.create('tinymce.plugins.MyPluginName', {
    init: function(ed, url){
      ed.addButton('shortcodelistbtn', {
        title: 'Shortcode List',
        cmd: 'shortcodelistcmd',
        text: '[]'
      });
      ed.addButton('contentcleanupbtn', {
        title: 'Content Cleanup',
        cmd: 'contentcleanupcmd',
        text: 'Content Cleanup',
      });
      ed.addButton('affiliateshortcodesbtn', {
        title: 'Affiliate Shortcodes',
        cmd: 'insertshortcodescmd',
        text: 'Affiliate Shortcodes'
      });
      ed.addButton('inahurrybtn', {
        title: 'In A Hurry Shortcode',
        cmd: 'inahurrycmd',
        text: 'In A Hurry?'
      });

      ed.addCommand('shortcodelistcmd', function() {
        var win = ed.windowManager.open({
          title: 'Shortcode List',
          body: [
            {
              type: 'textbox',
              name: 'Affiliate Links',
              label: 'Affiliate Links',
              minWidth:500,
              value: '[amazon link="ASIN" title="TITLE"]'

            },
            {
              type: 'textbox',
              name: 'Affiliate Images (Center)',
              label: 'Affiliate Images (Center)',
              minWidth:500,
              value: '[amazon box="ASIN"]'
            },
            {
              type: 'textbox',
              name: 'Affiliate Buttons (Center)',
              label: 'Affiliate Buttons (Center)',
              minWidth:500,
              value: '[amazon link="ASIN" link_class="button amazon-button" title="Check Price and Reviews on Amazon"]'
            },
            {
              type: 'textbox',
              name: 'Before H2',
              label: 'Before H2',
              minWidth:500,
              value: '[amazon box="ASIN1, ASIN2, ASIN3" template="table"]'
            },
            {
              type: 'textbox',
              name: 'Multiple Product Boxex',
              label: 'Multiple Product Boxes',
              minWidth:500,
              value: '[amazon box="ASIN1, ASIN2" template="box"]'
            },
            {
              type: 'textbox',
              name: 'Textlink',
              label: 'Textlink',
              minWidth:500,
              value: '[amazon link="ASIN" title="TITLE" link_icon="amazon /]'
            }
          ],
          buttons: [
            {
              text: "Close",
              onclick: function() {
                win.close();
              }
            }
          ]
        });
      });

      ed.addCommand('contentcleanupcmd', function() {
         var selection = tinymce.activeEditor.getContent();
         selection = selection.replace(/\s\s+/g, ' ');
         $(selection + '*:empty').remove();
         console.log(selection);
         tinymce.activeEditor.setContent(selection);
      });


      ed.addCommand('inahurrycmd', function() {
            var selection = tinymce.activeEditor.getContent();
            var box = 'box=';
            function getIndicesOf(searchStr, str, caseSensitive) {
                var searchStrLen = searchStr.length;
                if (searchStrLen == 0) {
                    return [];
                }
                var startIndex = 0, index, indices = [];
                if (!caseSensitive) {
                    str = str.toLowerCase();
                    searchStr = searchStr.toLowerCase();
                }
                while ((index = str.indexOf(searchStr, startIndex)) > -1) {
                    indices.push(index);
                    startIndex = index + searchStrLen;
                }
                return indices;
            }
            var indexArr = getIndicesOf(box, selection);
            var ASIN1 = selection.substring(indexArr[0] + 5, indexArr[0] + 15);
            var ASIN2 = selection.substring(indexArr[1] + 5, indexArr[1] + 15);
            var ASIN3 = selection.substring(indexArr[2] + 5, indexArr[2] + 15);
            var hurryShortcode = '[amazon box="' + ASIN1 + ', ' + ASIN2 + ', ' + ASIN3 + '" template="table"]';
            if (!selection.includes('IN A HURRY')) {
                tinymce.activeEditor.execCommand('mceInsertContent', 0, '<h3>IN A HURRY? HERE&#39;S OUR FAVORITE PICKS...</h3>' + '<p style="text-align:center;">' + hurryShortcode + '</p>');
            }
      });

      ed.addCommand('insertshortcodescmd', function(){
            //** Cleanup code
            var selection = tinymce.activeEditor.getContent();
            selection = selection.replace(/\s\s+/g, ' ') ;

            //** Shortcode variables
            var shortcodeOne = '[amazon link="ASIN" title="TITLE"]';
            var shortcodeTwo = '[amazon box="ASIN"]';
            var shortcodeThree = '[amazon link="ASIN" link_class="button amazon-button" title="Check Price and Reviews on Amazon"]';

            //** For each a tag that has amazon.com in it
            $(selection).find('a[href*="amazon.com"]').each(function() {

                //** Variables related to a tag
                var href = $(this).attr('href');
                var title = $(this).prop('innerHTML');
                if (href.includes('/dp/')) {
                    var ASIN = href.split('dp/')[1].substr(0,10);
                } else if (href.includes('product/')) {
                    var ASIN = href.split('product/')[1].substr(0,10);
                }

                //** outer HTML code of H3
                var parentHTML = $(this).parent().prop('outerHTML');
                //** number of current H3
                var number = $(this).parent().prop('innerHTML').charAt(0);
                //** Runs if amazon.com link is within H3 tag
                if (parentHTML.includes('h3')) {
                     //** replaces first part of product with div.box and adds in the first 2 shortcodes
                     selection = selection.replace(parentHTML, '<div class="box"><h3>' + number + '. ' + shortcodeOne + '</h3>' + '<p style="text-align:center;">' + shortcodeTwo + '</p>');
                     //** looks for next ul that doesn't have the "ready" class"
                     var nextULHTML = $(selection).find('ul:not(.ready)').prop('outerHTML');
                     //** only runs on next ul tag that doesn't have the ready class
                     if (!(nextULHTML.includes('ready'))) {
                          //** create a new variable titled 'newULHTML' that adds 'ready' class and replaces end tags with closing div
                          //** and a new shortcode
                          newULHTML = nextULHTML.replace('<ul>', '<ul class="ready">');
                          newULHTML = newULHTML.replace('</ul>', '</ul>' + '<p style="text-align:center;">' + shortcodeThree + '</div><hr />');
                          //** adds the newULHTML text to the selection
                          selection = selection.replace(nextULHTML, newULHTML);
                     }
                }
                //** For each amazon.com A tag, replaces all instances of ASIN and TITLE texts with the appropriate variables
                selection = selection.replaceAll('ASIN', ASIN);
                selection = selection.replace('TITLE', title);
            });

          



            tinymce.activeEditor.setContent(selection);
      });
    },
    getInfo: function() {
      return {
        longname : 'My Custom Buttons',
        author : 'Vortex Sky',
        authorurl : 'https://vortexskyllc.com/',
        version : "1.0"
      };
    }
  });
  tinymce.PluginManager.add( 'mytinymceplugin', tinymce.plugins.MyPluginName );
})(jQuery);
