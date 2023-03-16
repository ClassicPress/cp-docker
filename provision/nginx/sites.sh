#!/usr/bin/env bash

domain=$1
provision=$2
repo=$3
host=$4
type=$5
dir=$6
custom=$7
settings="/srv/.global/.settings.yml"

get_production() {
    local value=`cat ${settings} | shyaml get-value settings.production 2> /dev/null`
    echo ${value:-$@}
}

get_custom_value() {
    local value=`cat ${custom} | shyaml get-value sites.${domain}.custom.${1} ${2} 2> /dev/null`
    echo ${value:-$@}
}

production=`get_production`
username=`get_custom_value 'username' 'admin'`
password=`get_custom_value 'password' 'password'`
email=`get_custom_value 'email' "admin@${domain}.test"`

php=`get_custom_value 'php' '7.0'`
subs=`get_custom_value 'subdomains' ''`

if [[ "${production}" == "false" || "${production}" == "False" ]]; then
    if [[ "${provision}" == "true" || "${provision}" == "True" ]]; then
        if [[ ! -z "${type}" ]]; then
            if [[ "${type}" == "ClassicPress" || "${type}" == "classicpress" ]]; then
                if [[ ! -f "/etc/nginx/conf.d/${domain}.test.conf" ]]; then
                    sudo cp "/srv/config/nginx/local/default.conf" "/etc/nginx/conf.d/${domain}.test.conf"
                    sudo sed -i -e "s/{{DOMAIN}}/${domain}/g" "/etc/nginx/conf.d/${domain}.test.conf"
                fi
            fi
        fi
    fi
elif [[ "${production}" == "true" || "${production}" == "True" ]]; then
    if [[ "${provision}" == "true" || "${provision}" == "True" ]]; then
        if [[ ! -f "/etc/nginx/conf.d/${domain}.com.conf" ]]; then
            sudo cp "/srv/config/nginx/live/default.conf" "/etc/nginx/conf.d/${domain}.com.conf"
            sudo sed -i -e "s/{{DOMAIN}}/${domain}/g" "/etc/nginx/conf.d/${domain}.com.conf"
        fi
    fi
fi

if [[ "${provision}" == "true" || "${provision}" == "True" ]]; then
    if [[ ! -d "${dir}/provision/.git" ]]; then
        git clone --branch main ${repo} ${dir}/provision -q
    else
        cd ${dir}/provision
        git pull -q
        cd /app
    fi

    if [[ -d ${dir} ]]; then
        if [[ -f ${dir}/provision/setup.sh ]]; then
            source ${dir}/provision/setup.sh
        fi
    fi
fi
