const fs = require('fs');
const {
    S3,PutObjectCommand 
} = require('@aws-sdk/client-s3');





const s3 = new S3({
    region: 'us-east-1',

    credentials: {
        accessKeyId: 'AKIA2Z6O2TNHS6WZGS7S',
        secretAccessKey: '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'
    },  
});

s3.createBucket({
    Bucket: 'rakesh-travel-pics-bucket'
}, (error, success) => {
    if (error) {
        console.log('create failed', error);
    } else {
        console.log('successfully created');
    }
});

function uploadFile(filePath,number,postCount) {
    const bucket = 'rakesh-travel-pics-bucket';
    const key = postCount + 'image' + number + '.png';
    try {

        fs.readFile(filePath, (err, data) => {
            const uploadParams = {
                Bucket: bucket,
                Key: key,
                Body: data
            };
            const command = new PutObjectCommand(uploadParams);
            s3.send(command);
            

        });
        return 'https://' + bucket + '.s3.amazonaws.com/' + key;
       
        
    } catch (err) {
        console.log(err);
        throw err;
    }
  
    
}

module.exports = {
    uploadFile: uploadFile
};