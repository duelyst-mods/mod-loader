// Duelyst mod loader
// Copyright (c) 2017 "Cowboy" Ben Alman
// https://github.com/cowboy/duelyst-mod-loader

function writeFile(path, text) {
  log('Writing file:', path);
  var f = fso.CreateTextFile(path, true);
  f.Write(text);
  f.Close();
}

log();

fetchAsset('mod-loader/mod-loader.js');

if (createDir('mods')) {
  fetchAsset('mods/sample.js');
  log('> Created mod directory and sample mod.');
  log();
}

var base = 'v' + installs.duelyst.version + '\\resources\\app\\src\\';
var src = base + 'index.html';
var bak = src + '.bak';

var html = readFile(src);

var script = '<script id=modloader src="../../../../mod-loader/mod-loader.js" crossorigin><\/script>';

var newHtml = html.replace(/<script( id=modloader)?[\s\S]*?<\/script>/, function(match, isModloader) {
  if (isModloader) {
    if (match === script) {
      log('> Up-to-date modloader script detected.');
      return match;
    }
    log('> Out-of-date modloader script detected, updating...');
    return script;
  }
  log('> No modloader script detected, adding...');
  return script + match;
})

if (newHtml !== html) {
  log('Creating backup...');
  writeFile(bak, html);
  log('Updating index...');
  writeFile(src, newHtml);
}
else {
  log('No changes needed!');
}