#!/bin/bash
echo "Deploying to Github pages"
echo "Make sure everything you want to save is commited"
read -p "Press any key to continue... "

# moving files around. crazy shit.
mv index.html index.html.bk
cp release.html index.html

git branch -D gh-pages
git checkout --orphan gh-pages
git reset
npm install
npm run build

git add index.html
git add main.css
git add main.css.map
git add bundle.min.js
git commit -m "deploying project"
git push origin gh-pages --force


#restore
git checkout master --force
mv index.html.bk index.html
