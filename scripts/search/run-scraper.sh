#!/bin/bash

# **WARNING**
# Do not execute this script directly!
# You should run scrape-and-compare-algolia-index.js instead.
# That script will invoke this bash script. It contains
# additional checks to make sure that we are not suddenly
# over/under indexing the documentation site.
# If you do need to run this script directly, please
# make sure you know what you are doing :). 

# if [ "$APPLICATION_ID" == "" ];
# then
#   echo "Missing Algolia APPLICATION_ID"
#   exit 1
# fi

# if [ "$API_KEY" == "" ];
# then
#   echo "Missing Algolia API_KEY"
#   echo "This is the 'Write API' key (not search or admin)"
#   exit 1
# fi

echo "Reading config.json"
CONFIG=`cat config.json`
export CONFIG

docker run -e APPLICATION_ID \
  -e API_KEY \
  -e CONFIG \
  -t algolia/docsearch-scraper:v1.6.0

# Without this sleep, the docsearch-scraper will not completely
# upload all items to the index when this runs in CircleCI.
# If you run this locally without the sleep, all items
# should appear in the index. I have not verified that 2 minutes
# are necessary; however, some amount of time *is* necessary.
sleep 2m