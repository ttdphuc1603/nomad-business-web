module.exports.CreateSuccess= (statusCode, successmessage, data)=>{
   const successObj={
    status:statusCode,
    message:successmessage,
    data:data
   }
   return successObj
}