var db = require('../config/connection')
var collection = require('../config/collections')
const { response } = require('../app')
const { ObjectId } = require('mongodb')
// var objectId = require('mongodb').ObjectId

module.exports = {

    addProduct: async (product,callback) =>{
        console.log(product)

        let existData = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({Name:product.Name})

        if(existData){
            console.log('Product with the same name already exists');
            callback(null, 'Product with the same name already exists');
        }else{

        db.get().collection('product').insertOne(product).then((data)=>{

            // console.log('---details----',data)
            console.log('Product inserted successfully');
            callback(data.insertedId)
        })}
    },

    getAllProducts:()=>{
        return new Promise(async(resolve,reject)=>{
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(products)
        })
    },



    deleteProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            
           db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id: new ObjectId(prodId)}).then((response)=>{
            // console.log(`------  component with ${new ObjectId(prodId)} deleted`)
            console.log(response)
            resolve(response)
           })

        })
    },



    getProductDetails:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:new ObjectId(prodId)}).then((product)=>{
                resolve(product)
            })
        })
    },



    updateProduct:(prodId,proDetails)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION)
            .updateOne({_id:new ObjectId(prodId)}, {
                $set:{
                    Name:proDetails.Name,
                    Description:proDetails.Description,
                    Price:proDetails.Price,
                    Category:proDetails.Category
                }
            }).then((response)=>{
                resolve()
            })
        })
    }







}




