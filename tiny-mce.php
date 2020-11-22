<?php

function tiny_mce_add_buttons( $plugins ) {
  $plugins['mytinymceplugin'] = get_template_directory_uri() . '/js/tiny-mce/tiny-mce.js';
  return $plugins;
}

function tiny_mce_register_buttons( $buttons ) {
  $newBtns = array(
    'affiliateshortcodesbtn',
    'inahurrybtn',
    'contentcleanupbtn',
    'shortcodelistbtn'
  );
  $buttons = array_merge( $buttons, $newBtns );
  return $buttons;
}

add_action( 'init', 'tiny_mce_new_buttons' );

function tiny_mce_new_buttons() {
  add_filter( 'mce_external_plugins', 'tiny_mce_add_buttons' );
  add_filter( 'mce_buttons', 'tiny_mce_register_buttons' );
}

?>
