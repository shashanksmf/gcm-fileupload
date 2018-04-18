var mime = require('mime');
module.exports.uploadFile = function(fileName){

  const keyFilename="./private-key-file.json"; //replace this with api key file
  const projectId = "fluent-observer-114411" //replace with your project id
  const bucketName = `${projectId}.appspot.com`;

  const gcs = require('@google-cloud/storage')({
      projectId,
      keyFilename
  });

  const bucket = gcs.bucket(bucketName);

  const filePath = "./" + fileName;
  const uploadTo = `subfolder/${fileName}`;
  const fileMime = mime.getType(filePath);

  bucket.upload(filePath,{
      destination:uploadTo,
      public:true,
      metadata: {contentType: fileMime,cacheControl: "public, max-age=300"}
  }, function(err, file) {
      if(err)
      {
          console.log(err);
          return;
      }
      // console.log(createPublicFileURL(uploadTo));
  });
}
