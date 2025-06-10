const path = require('node:path');
const nodeExternals = require('webpack-node-externals');

module.exports = (options, _webpack) => {
    const lazyImports = [
        '@nestjs/microservices',
        '@nestjs/platform-express',
        'class-transformer/storage',
    ];

    return {
        ...options,
        externals: [
            nodeExternals({
                allowlist: ['@app/core', /^@app\/core\/.*$/],
            }),
        ],
        output: {
            ...options.output,
            library: {
                type: 'commonjs2',
            },
        },
        plugins: [
            ...options.plugins,
            new _webpack.IgnorePlugin({
                checkResource(resource) {
                    if (lazyImports.includes(resource)) {
                        try {
                            require.resolve(resource);
                        } catch (_err) {
                            return true;
                        }
                    }
                    return false;
                },
            }),
        ],
        resolve: {
            ...options.resolve,
            alias: {
                ...options.resolve?.alias,
                '@app/core': path.resolve(__dirname, '../../libs/core/src'),
            },
        },
    };
};
