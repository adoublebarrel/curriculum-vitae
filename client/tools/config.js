{
  appDir: '../app',
  baseUrl: 'js',
  dir: '../deploy',
  paths: {
    flight: "../bower_components/flight",
    // jquery: "../bower_components/jquery/dist/jquery",
    requirejs: "../bower_components/requirejs/require",
    component: "component"
  },
  optimize: 'uglify2',
  // generateSourceMaps: true,
  preserveLicenseComments: false,
  skipDirOptimize: true,
  modules: [
    {
      name: 'common',
      include: [
        'requirejs',
        'flight/lib/advice',
        'flight/lib/compose',
        'flight/lib/debug',
        'flight/lib/logger',
        'flight/lib/registry',
        'component/navbar-ui'
      ]
    },
    {
      name:'main',
      include: ['page/default'],
      exclude: ['common']
    },
    {
      name: 'tech-skills',
      include: ['page/tech-skills'],
      exclude: ['common']      
    },
    {
      name: 'contact',
      include: ['page/contact'],
      exclude: ['common']
    }
  ]
}
