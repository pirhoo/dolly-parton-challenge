const gh = require('gh-pages');
const path = require('path');
const ora = require('ora')
const chalk = require('chalk')

process.env.NODE_ENV = 'production'

const spinner = ora('push dist folder to gh-pages branch...')
const message = 'Updates [ci skip]'
spinner.start()

gh.publish(path.join(process.cwd(), 'dist'), { message }, () => {
  spinner.stop()
  // eslint-disable-next-line no-console
  console.log(chalk.cyan('  Push complete.\n'))
});
