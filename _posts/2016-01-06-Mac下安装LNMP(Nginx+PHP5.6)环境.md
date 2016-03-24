---
layout: detail
title: Mac下安装LNMP(Nginx+PHP5.6)环境
author: 罗智毅
type: 3
picSrc: arc-3.jpg
tags: [LNMP环境,Mac下安装LNMP]
describe: 最近工作环境切换到Mac，所以以OS X Yosemite（10.10.1）为例，记录一下从零开始安装Mac下LNMP环境的过程
---

### 安装Homebrew ###
    ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"

### formula ###
    brew tap homebrew/dupes

    brew tap homebrew/versions

    brew tap homebrew/php

### 安装PHP5.6 ###
    brew install php56 \
    --without-snmp \
    --without-apache \
    --with-fpm \
    --with-intl \
    --with-homebrew-curl \
    --with-homebrew-libxslt \
    --with-imap \
    --with-mysql \
    --with-tidy

### 安装扩展 ###

*Memcache*

    brew install php56-memcache

*Mongo*

    brew install php56-mongo
  
*Redis*

> 在安装时发生了错误，可能与使用josegonzalez/php有关
>
> brew unlink php56-igbinary
> 
> brew link --overwrite php56-igbinary

    brew install php56-redis

### php日志目录 ###
    mkdir -p /usr/local/var/log/php

### 安装Nginx ###
    brew install nginx

### 相关目录 ###
    mkdir -p /usr/local/var/log/nginx

    mkdir -p /usr/local/etc/nginx/

### ngnix.conf配置内容如下： ###
    vim /usr/local/etc/nginx/nginx.conf

    user _www _www;

    worker_processes  1;

    error_log /usr/local/var/log/nginx/error.log notice;

    pid /usr/local/var/run/nginx.pid;

    events {
        worker_connections  256;
    }

    http {
        include       mime.types;
        default_type  application/octet-stream;

        server_names_hash_bucket_size 128;
        client_header_buffer_size 32k;
        large_client_header_buffers 4 32k;
        client_max_body_size 8m;

        sendfile on;
        tcp_nopush on;
        tcp_nodelay on;

        keepalive_timeout 60;

        # fastcgi
        fastcgi_connect_timeout 300;
        fastcgi_send_timeout 300;
        fastcgi_read_timeout 300;
        fastcgi_buffer_size 64k;
        fastcgi_buffers 4 64k;
        fastcgi_busy_buffers_size 128k;
        fastcgi_temp_file_write_size 128k;

        # gzip
        gzip on;
        gzip_min_length 1k;
        gzip_buffers 4 16k;
        gzip_http_version 1.0;
        gzip_comp_level 2;
        gzip_types text/plain application/x-javascript text/css application/xml;
        gzip_vary on;

        # log format
        log_format main ‘$remote_addr - $remote_user [$time_local] ‘
         ‘”$request” $status $body_bytes_sent ‘
         ‘”$http_referer” “$http_user_agent” ‘
         ‘”$http_x_forwarded_for” $host $request_time $upstream_response_time $scheme ‘
         ‘$cookie_evalogin’;

        # 虚拟主机配置
        include /usr/local/etc/nginx/vhosts/*;
    }

### 虚拟主机配置 ###

> 在/usr/local/etc/nignx/vhosts/目录下，增加 [主机名].conf 文件

    server {
        listen 80;
        # 需要配置的域名
        server_name www.imaibo.local;
        index index.html index.htm index.php;
        # 站点根目录
        root /Users/happy/coding/svn_now/imaibo/trunk/;

        location ~ .*\.php$ {
            fastcgi_pass unix:/tmp/php-fpm.sock;
            fastcgi_index index.php;
            include /usr/local/etc/nginx/fastcgi.conf;
        }

        location ~ .*\.(gif|jpg|jpeg|png|bmp|swf)$ {
            expires 30d;
        }

        location ~ .*\.(js|css)?$ {
            expires 1d;
        }

        access_log /usr/local/var/log/nginx/www.imaibo.local.access.log main;
    }

### 配置php-fpm.conf ###
    vim /usr/local/etc/php/5.6/php-fpm.conf

    pid = run/php-fpm.pid # 目录在/usr/local/var

    error_log = log/php-fpm.log # 目录在/usr/local/var

    log_level = notice

    user = _www
    group = _www

    listen = /tmp/php-fpm.sock
    listen.backlog = 65535
    listen.owner = _www
    listen.group = _www
    listen.mode = 0666

    slowlog = /usr/local/var/log/php/$pool.log.slow
    request_slowlog_timeout = 10
    request_terminate_timeout = 300

### 加入环境变量配置 ###
    echo 'export PATH="$(brew --prefix php56)/bin:$PATH"' >> ~/.bash_profile  #for php

    echo 'export PATH="$(brew --prefix php56)/sbin:$PATH"' >> ~/.bash_profile  #for php-fpm

    echo 'export PATH="/usr/local/bin:/usr/local/sbin:$PATH"' >> ~/.bash_profile #for other brew install soft

    source ~/.bash_profile

### 启动和停止 ###

##### 启动 php-fpm #####

    php-fpm -D
    sudo php-fpm -D

##### 关闭 #####
    killall php-fpm
    sudo killall php-fpm

##### 开启 #####
    nginx
    sudo nginx

##### 关闭 #####
    kill -TERM `cat /usr/local/var/run/nginx.pid`
    sudo kill -TERM `cat /usr/local/var/run/nginx.pid`

##### 从容关闭 #####
    kill -QUIT `cat /usr/local/var/run/nginx.pid`
    sudo kill -QUIT `cat /usr/local/var/run/nginx.pid`


### 修改配置 ###

#### vhsot ####

    vim /usr/local/etc/nginx/vhosts/www.imaibo.local.conf

#### php-fpm ####
    vim /usr/local/etc/php/5.6/php-fpm.conf

#### nginx ####
    vim /usr/local/etc/nginx/nginx.conf

### 查看进程 ###


#### 查看nginx进程 ####
    ps aux|grep nginx

#### 查看php-fpm进程 ####
    ps aux|grep php-fpm


### 总结 ###

#### nginx 日志目录路径 ####
    /usr/local/var/log/nginx/

#### php 日志目录路径 ####
    /usr/local/var/log/php/

#### 虚拟主机目录路径 ####
    /usr/local/etc/nginx/vhosts

#### nginx.conf 配置 ####
    /usr/local/etc/nginx/nginx.conf

#### php-fpm.conf 配置 ####
    /usr/local/etc/php/5.6/php-fpm.conf

#### fastcgi.conf 配置 ####
    /usr/local/etc/nginx/fastcgi.conf;

#### nginx 错误日志 ####
    /usr/local/var/log/nginx/error.log

#### php-fpm 错误日志 ####
    /usr/local/var/log/php-fpm.log

#### nginx.pid 文件 ####
    /usr/local/var/run/nginx.pid

#### php-fpm.sock 文件 ####
    /usr/local/var/run/php-fpm.sock
    /tmp/php-fcgi.sock

#### 端口查看 ####
    sudo lsof -i -P | grep -i "listen"
    lsof -iTCP:8080 | grep LISTEN
    lsof -n -i4TCP:8080 | grep LISTEN
    lsof -i tcp:8080
    lsof -i tcp:80