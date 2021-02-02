#!/usr/bin/env node

const Tracer = require('nmmes-tracer');

const logger = new Tracer.Logger({
    transports: [
        new Tracer.transports.Console(),
        new Tracer.transports.File({
          path: './lib/output.log'
        }),
    ]
});

module.exports = logger;
