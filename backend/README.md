技术栈：
    nestJs-TS
    mongoDB
        授权数据库
        docker exec -it mongodb-primary /bin/bash
	    mongosh
        use baigao
        db.createUser({user:'baigao',pwd:'123456',roles:[{role:'dbOwner',db:'baigao'}]});
        db.auth("baigao","123456");
    redis
    rabbitMQ（可选）

# 生成免费的证书
certbot certonly --config "/etc/letsencrypt.ini" --cert-name "npm-10" --agree-tos --authenticator webroot --email "745387478@qq.com" --preferred-challenges "dns,http" --domains "test.baigao.com"

/etc/letsencrypt.ini
text = True
non-interactive = True
webroot-path = /data/letsencrypt-acme-challenge
key-type = ecdsa
elliptic-curve = secp384r1
preferred-chain = ISRG Root X1

# 设置旧生代（old generation）堆内存的最大大小 （长期没有释放的对象）
node --max_old_space_size=250 index.js
    
# 解决多级nginx代理后无法获取真实IP问题
    结构：域名nginx - 应用nginx
    1.应用nginx的http级新增如下代码
    ```
    # 通过一级代理的获取真实ip，172.18.0.2为域名nginxIp
    set_real_ip_from 172.18.0.2;
    real_ip_header X-Forwarded-For;
    ```
    2.域名级nginx，server中新增如下代码,nginx-proxy-manager的话在高级设置中添加即可
    ```
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    ```

## 搭建openvpn参考如下博客
    https://blog.csdn.net/qq_37510195/article/details/130777785