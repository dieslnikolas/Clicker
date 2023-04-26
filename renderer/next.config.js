module.exports = {

    // Use the CDN in production and localhost for development.
    webpack: (config, { isServer }) => {

        // Fixes npm packages that depend on `fs` module
        if (!isServer) {
            config.target = 'electron-renderer';
        }

        // Return config
        return config;
    },
};
