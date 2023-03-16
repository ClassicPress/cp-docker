#!/usr/bin/env bash

sudo service nginx reload > /dev/null 2>&1

sudo service php8.0-fpm reload > /dev/null 2>&1
