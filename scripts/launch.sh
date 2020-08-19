#!/bin/bash

${0%/*}/electron/electron ${0%/*}/electron/resources/app.asar "$@"
