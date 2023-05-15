FROM php:8.1.19-fpm-alpine3.18

WORKDIR /var/www/html
ENV APP_ENV=production
ENV APP_DEBUG=true

RUN apk update && \
    apk add --no-cache \
        git \
        curl \
        libpng-dev \
        oniguruma-dev \
        libxml2-dev \
        zip \
        unzip

RUN docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd

COPY . .
RUN mv .env.production .env

RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

RUN rm -rf vendor && \
    composer install --optimize-autoloader --no-dev

RUN chown -R www-data:www-data /var/www/html/storage




