const type = process.env.BUILD_TYPE;

let config = {};

if(type === "umd") {
  config = {
    umd: {
      file: 'react-undo-component',
      name: 'ReactUndoComponent',
      globals: {
        react: 'React',
      },
      sourcemap: true,
    },
    nodeResolveOpts: {
      browser: true,
    },
    runtimeHelpers: true,
    externalsExclude: ['react/jsx-runtime'],
  }

}else if (type === 'lib') {
  config = {
    esm: false,
    cjs: 'babel',
  };
} else {
  config = {
    esm: {
      type: 'babel',
      importLibToEs: true,
    },
    cjs: false,
  };
}

export default config;
