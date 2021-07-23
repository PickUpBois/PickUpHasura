#!/bin/bash

dir=/migrations

# get list of files in migration directory
files=$(ls ${dir})

# sort files
IFS=$'\n' 
sorted=($(sort <<<"${array[*]}"))
unset IFS

# run sql command for each file
for item in ${files}
do
    file="${dir}/${item}/up.sql"
    psql -v ON_ERROR_STOP=1 --username $POSTGRES_USER --dbname $POSTGRES_DB -f $file
done