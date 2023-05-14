FROM php:8.1.19-fpm-bullseye

WORKDIR /var/www/html

RUN apt-get update && \
    apt-get install -y \
        git \
        curl \
        libpng-dev \
        libonig-dev \
        libxml2-dev \
        zip \
        unzip

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY . .
RUN mv .env .env.development
RUN mv .env.production .env

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN rm -rf vendor && \
    composer install --optimize-autoloader --no-dev

RUN chown -R www-data:www-data /var/www/html/storage

ENV APP_ENV=production


