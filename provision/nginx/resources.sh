#!/usr/bin/env bash

production=$1
name=$2
repo=$3
custom=$4
dir=$5

if [[ "${production}" == "false" || "${production}" == "False" ]]; then
    if [[ ! -d ${dir}/.git ]]; then
        git clone --branch main ${repo} ${dir} -q
    else
        cd ${dir}
        git pull  -q
        cd /app
    fi

    source ${dir}/${name}/setup.sh 
elif [[ "${production}" == "true" || "${production}" == "True" ]]; then
    if [[ ! -d ${dir}/.git ]]; then
        git clone --branch main ${repo} ${dir} -q
    else
        cd ${dir}
        git pull  -q
        cd ~/.dev
    fi

    source ${dir}/${name}/setup.sh 
fi