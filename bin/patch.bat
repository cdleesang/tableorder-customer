@echo off

call cd %~dp0\..

call git pull

call yarn

call yarn build

pause