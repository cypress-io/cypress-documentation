#!/bin/bash

TMP_CLONE_DIR=./.__tmp__ 

log() {
  echo ">> $1"
}

clone_repo() {
  log "Running clone-current-docs.sh..."
  log "Cloning current Cypress documentation."
  rm -rf $TMP_CLONE_DIR
  mkdir $TMP_CLONE_DIR
  FORMER_DOCS_GIT_REPO=git@github.com:cypress-io/cypress-documentation.git
  git clone $FORMER_DOCS_GIT_REPO $TMP_CLONE_DIR
}

FORMER_REPO_DOCS_PATH=$TMP_CLONE_DIR/source/*
THIS_REPO_DOCS_PATH=./content

remove_existing_content() {
  log "Deleting ./content."
  mv $THIS_REPO_DOCS_PATH/settings.json ./copied-settings.json
  rm -rf $THIS_REPO_DOCS_PATH
  mkdir $THIS_REPO_DOCS_PATH
  mv ./copied-settings.json $THIS_REPO_DOCS_PATH/settings.json
}

move_copied_docs_into_project() {
  log "Moving cloned documentation into $THIS_REPO_DOCS_PATH from $FORMER_REPO_DOCS_PATH."
  mv $FORMER_REPO_DOCS_PATH $THIS_REPO_DOCS_PATH
  echo ">> Documentation copied into $THIS_REPO_DOCS_PATH."
}

move_copied_images_into_project() {
  # move images from themes/cypress/source/img to docs/assets
  # Add more images as necessary
  THEME_IMG_DIR=$TMP_CLONE_DIR/themes/cypress/source/img
  rm $THEME_IMG_DIR/favicon.ico $THEME_IMG_DIR/logo.png $THEME_IMG_DIR/logo@2x.png
  IMG_DIR=./assets

  # rm -rf $IMG_DIR
  # mv $THEME_IMG_DIR ./docs/assets

  # Merge the contents from $THEME_IMG_DIR into $IMG_DIR
  cp -r $THEME_IMG_DIR $IMG_DIR
  cp -r ./content/img $IMG_DIR
  rm -rf ./content/img
  # removing duplicate img dir
  rm -rf $IMG_DIR/img/img 
}

move_copied_sidebar_into_project() {
  SIDEBAR_YML=$TMP_CLONE_DIR/themes/cypress/languages/en.yml
  mv $SIDEBAR_YML $THIS_REPO_DOCS_PATH/_data/
}

remove_cloned_repo() {
  log "Cleaning cloned repo."
  rm -rf $TMP_CLONE_DIR
  log "Done copying documentation into current repo."
}

# We move the Table of Contents up one directory because the directories 
# within the `content/` directory are used to generate routes. Since the
# TOC is within api/api, this forces the TOC route to be api/api/table-of-contents.
# We want to remove one of the `api`s in the route, and we can do so by
# moving the TOC up one directory.
move_toc() {
  mv ./content/api/api/table-of-contents.md ./content/api/table-of-contents.md
  rm -rf ./content/api/api
}

rename_plugin_index_file() {
  mv ./content/plugins/index.md ./content/plugins/directory.md
}

# Utility functions

escape_slashes() {
  sed 's/\//\\\//g' 
}

change_line() {
  local OLD_LINE_PATTERN=$1; shift
  local NEW_LINE=$1; shift
  local FILE=$1

  local NEW=$(echo "${NEW_LINE}" | escape_slashes)
  sed -i .bak '/'"${OLD_LINE_PATTERN}"'/s/.*/'"${NEW}"'/' "${FILE}"
  mv "${FILE}.bak" /tmp/
}

# Main entrypoint

main() {
  clone_repo
  remove_existing_content
  move_copied_docs_into_project
  move_copied_images_into_project
  move_copied_sidebar_into_project
  remove_cloned_repo
  # The title line in each markdown file must be a string.
  # The 404.md file contains a title of the number 404.
  change_line "title: 404" "title: '404'" $THIS_REPO_DOCS_PATH/404.md
  move_toc
  rename_plugin_index_file
}

main