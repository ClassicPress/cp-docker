#!/bin/bash

db_restores=$2
custom=$3

get_sites() {
    local value=`cat ${custom} | shyaml keys sites 2> /dev/null`
    echo ${value:-$@}
}

for domain in `get_sites`; do
    get_default_value() {
        local value=`cat ${custom} | shyaml get-value sites.${domain}.${1} 2> /dev/null`
        echo ${value:-$@}   
    }

    get_custom_value() {
        local value=`cat ${custom} | shyaml get-value sites.${domain}.custom.${1} ${2} 2> /dev/null`
        echo ${value:-$@}   
    }

    provision=`get_default_value 'provision' ''`
    type=`get_default_value 'type' ''`

    subdomains=`get_custom_value 'subdomains' ''`

    if [[ "${provision}" == "true" || "${provision}" == "True" ]]; then
        if [[ "${type}" == "ClassicPress" || "${type}" == "classicpress" ]]; then
            mysql -u root -e "CREATE USER IF NOT EXISTS 'classicpress'@'%' IDENTIFIED BY 'classicpress';"
            mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${domain};"
            mysql -u root -e "GRANT ALL PRIVILEGES ON ${domain}.* to 'classicpress'@'%' WITH GRANT OPTION;"
            mysql -u root -e "FLUSH PRIVILEGES;"

            if [[ ! -z "${subdomains}" ]]; then
                for sub in ${subdomains//- /$'\n'}; do
                    if [[ "${sub}" != "subdomains" ]]; then
                        mysql -u root -e "CREATE USER IF NOT EXISTS 'classicpress'@'%' IDENTIFIED BY 'classicpress';"
                        mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${domain}_${sub};"
                        mysql -u root -e "GRANT ALL PRIVILEGES ON ${domain}_${sub}.* to 'classicpress'@'%' WITH GRANT OPTION;"
                        mysql -u root -e "FLUSH PRIVILEGES;"
                    fi
                done
            fi
        elif [[ "${type}" == "WordPress" || "${type}" == "wordpress" ]]; then
            mysql -u root -e "CREATE USER IF NOT EXISTS 'wordpress'@'%' IDENTIFIED BY 'wordpress';"
            mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${domain};"
            mysql -u root -e "GRANT ALL PRIVILEGES ON ${domain}.* to 'wordpress'@'%' WITH GRANT OPTION;"
            mysql -u root -e "FLUSH PRIVILEGES;"

            if [[ ! -z "${subdomains}" ]]; then
                for sub in ${subdomains//- /$'\n'}; do
                    if [[ "${sub}" != "subdomains" ]]; then
                        mysql -u root -e "CREATE USER IF NOT EXISTS 'wordpress'@'%' IDENTIFIED BY 'wordpress';"
                        mysql -u root -e "CREATE DATABASE IF NOT EXISTS ${domain}_${sub};"
                        mysql -u root -e "GRANT ALL PRIVILEGES ON ${domain}_${sub}.* to 'wordpress'@'%' WITH GRANT OPTION;"
                        mysql -u root -e "FLUSH PRIVILEGES;"
                    fi
                done
            fi
        fi
    fi
done

if [[ ${db_restores} != "false" ]]; then
    cd /srv/databases
    count=$(ls -1 *.sql 2>/dev/null | wc -l)

    if [[ ${count} != 0 ]]; then
        for file in $( ls *.sql ); do
            database=${file%%.sql}

            exists=`mysql -u root -e "SHOW TABLES FROM ${database};"`

            if [[ "" == ${exists} ]]; then
                mysql -u root ${database} < ${database}.sql
            fi
        done
    fi
fi

