## git地址：https://github.com/wechatpay-apiv3/CertificateDownloader
## 用于第一次生成平台证书
### 你没有证书，第一次下载证书
```

java -jar CertificateDownloader.jar -k ${apiV3key} -m ${mchId} -f ${mchPrivateKeyFilePath} -s ${mchSerialNo} -o ${outputFilePath}

示例：
java -jar CertificateDownloader.jar -k M1EW2Z4XXXXXXX -m 149XXXXXXX -f ./cert/apiclient_key.pem -s 2D494AXXXXXXXX -o ./
```
### 如果你已有微信支付平台证书，完整命令如：
```
java -jar CertificateDownloader.jar -k ${apiV3key} -m ${mchId} -f ${mchPrivateKeyFilePath} -s ${mchSerialNo} -o ${outputFilePath} -c ${wechatpayCertificateFilePath}
```

必需参数有：

-f <privateKeyFilePath>，商户API私钥文件路径
-k <apiV3Key>，证书解密的密钥
-m <merchantId>，商户号
-o <outputFilePath>，保存证书的路径
-s <merchantSerialNo>，商户API证书的序列号
非必需参数有：

-c <wechatpayCertificatePath>，微信支付平台证书的路径。如果你还没有证书，请先不传该参数。