set -e
git checkout dev

npm run prepublishOnly
npm version minor
git push

git checkout teslemetry
git rebase dev -X ours
git push --force-with-lease
rm -r dist
npm publish

git checkout tessie
git rebase dev  -X ours
git push --force-with-lease
rm -r dist
npm publish

git checkout dev