FROM harbor.sfxsgroup.com/sfxs/nginx:1.25-utf8
RUN mkdir -p /home/sfxs/dms/logs
VOLUME /home/sfxs/dms/logs
WORKDIR /opt
COPY dist /usr/share/nginx/html/
COPY default.conf /etc/nginx/conf.d/
COPY nginx.conf /etc/nginx/
EXPOSE 80
