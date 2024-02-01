var db = require('../config/connection')
var collection = require('../config/collections')
var bcrypt = require('bcrypt')
var {ObjectId}  =require('mongodb')
const { response } = require('../app')



module.exports ={

    doSignup:  (userData)=>{
        return new Promise(async(resolve,reject)=>{
            userData.Password = await bcrypt.hash(userData.Password,10)
       const result=   db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((data)=>{
                console.log(data)
                resolve(data)
            })
        })

    },

    doLogin : (userData)=>{
        return new Promise(async(resolve,reject)=>{
            let user = await db.get().collection(collection.USER_COLLECTION).findOne({Email:userData.Email})
            loginStatus = false
            let response = {}
            if(user){
                bcrypt.compare(userData.Password,user.Password).then((status)=>{   
                    if(status){
                        console.log('login success')
                        response.user = user
                        response.status = true
                        resolve(response)
                    }else{
                        console.log('login failed')
                        resolve({status:false})
                    }
                })
            }else{
                console.log('login failed')
                resolve({status:false})
            }
        })
    },



    addToCart : (prodId,userId)=>{

        let proObj = {
            item : new ObjectId(prodId),
            quantity : 1
        }

        return new Promise(async(resolve,reject)=>{
            let userCart = await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
            if(userCart){


                let proExist = userCart.products.findIndex(product =>  product.item.equals(new ObjectId(prodId)))


                // let proExist = userCart.products.findIndex(product => product.item && product.item.equals(new ObjectId(prodId)))

                // let proExist = userCart.products.findIndex(product => {
                //     return product.item && product.item.equals(new ObjectId(prodId));
                // });

                // let proExist = userCart.products.findIndex(product => {
                //     if (product.item) {
                //         return product.item.equals(new ObjectId(prodId));
                //     } else {
                //         return product.equals(new ObjectId(prodId));
                //     }
                // });

                console.log(proExist)
                if(proExist != -1){
                    db.get().collection(collection.CART_COLLECTION)
                    .updateOne({'products.item' : new ObjectId(prodId)},
                    {
                        $inc:{'products.$.quantity': 1}
                    }).then(()=>{
                        resolve()
                    })
                }else{

                db.get().collection(collection.CART_COLLECTION)
                .updateOne({user:new ObjectId(userId)},
                {
                    $push:{products: proObj}
                }).then((response)=>{
                    resolve()
                })
            }
            }else{
                let cartObj = {
                    user:new ObjectId(userId),
                    products:[proObj]
                }
                db.get().collection(collection.CART_COLLECTION).insertOne(cartObj).then((response)=>{
                    resolve()
                })
            }
        })
    },

    getCartProducts:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let cartItems = await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:new ObjectId(userId)}
                },
                {
                    $unwind:'$products'
                },
                {
                    $project : {
                        item :'$products.item',
                        quantity :'$products.quantity'
                    }
                },
                {
                    $lookup:{
                        from : collection.PRODUCT_COLLECTION,
                        localField:'item',
                        foreignField:'_id',
                        as:'product'
                    }
                }
                // {
                //     $lookup:{
                //         from:collection.PRODUCT_COLLECTION,
                //         let:{prodList:'$products'},
                //         pipeline:[
                //             {
                //                 $match:{
                //                     $expr:{
                //                         $in:['$_id',"$$prodList"]
                //                     }
                //                 }
                //             }
                //         ],
                //         as:'cartItems'
                //     }
                // }
            ]).toArray()
            console.log(cartItems[0].products)
            resolve(cartItems)
        })
    },


    getCartCount:(userId)=>{
        return new Promise(async(resolve,reject)=>{
            let count = 0
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:new ObjectId(userId)})
            if(cart){
                count = cart.products.length
            }
            resolve(count)
        })
    }
}


