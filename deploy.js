const gh = require('gh-pages');
const path = require('path');
const chalk = require('chalk');

process.env.NODE_ENV = 'production'

// eslint-disable-next-line no-console
console.log('push dist folder to gh-pages branch...')
const message = 'Updates [ci skip]'

gh.publish(path.join(process.cwd(), 'dist'), { message }, () => {
  // eslint-disable-next-line no-console
  console.log(chalk.cyan('Push complete.\n'))
});
